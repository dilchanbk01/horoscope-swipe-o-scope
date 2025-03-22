
import React, { useState, useEffect } from 'react';
import { getZodiacSignByBirthday } from '@/utils/zodiacData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BirthDateForm from './BirthDateForm';
import HoroscopeContent from './HoroscopeContent';
import { Button } from '@/components/ui/button';
import { Sparkles, Star } from 'lucide-react';
import { saveFavoriteSign, isSignFavorited } from '@/services/horoscopeApi';
import { useAuth } from '@/hooks/useAuth';

const PersonalHoroscope: React.FC = () => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [sign, setSign] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [weeklyHoroscope, setWeeklyHoroscope] = useState<string[] | null>(null);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [luckyColor, setLuckyColor] = useState<string>('');
  const [luckyTime, setLuckyTime] = useState<string>('');
  const [compatibleSigns, setCompatibleSigns] = useState<string[]>([]);
  const [mood, setMood] = useState<string>('');
  const [moonPhase, setMoonPhase] = useState<string>('');
  const [energyLevels, setEnergyLevels] = useState<{
    mental: number;
    physical: number;
    emotional: number;
  }>({ mental: 0, physical: 0, emotional: 0 });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Load saved birth date on component mount
  useEffect(() => {
    const savedDay = localStorage.getItem('zodiac_birth_day');
    const savedMonth = localStorage.getItem('zodiac_birth_month');
    
    if (savedDay && savedMonth) {
      setDay(savedDay);
      setMonth(savedMonth);
      handleBirthDateSubmit(savedDay, savedMonth);
    }
  }, []);
  
  // Handle birth date submission and fetch horoscope data
  const handleBirthDateSubmit = async (day: string, month: string) => {
    setIsLoading(true);
    
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    
    const zodiacSign = getZodiacSignByBirthday(monthNum, dayNum);
    
    if (zodiacSign) {
      setSign(zodiacSign.name);
      
      try {
        // Check if this sign is a favorite for the current user
        if (user) {
          const favorited = await isSignFavorited(zodiacSign.name);
          setIsFavorite(favorited);
        }
        
        // Save to localStorage for future visits
        localStorage.setItem('zodiac_birth_day', day);
        localStorage.setItem('zodiac_birth_month', month);
        
        // Fetch horoscope data from our edge function
        const { data: aztroData, error: aztroError } = await supabase.functions.invoke("aztro-horoscope", {
          body: { sign: zodiacSign.name.toLowerCase(), day: "today" }
        });

        if (aztroError) {
          console.error("Error fetching aztro data:", aztroError);
          toast({
            title: "Oops!",
            description: "We had trouble connecting to the stars. Please try again.",
            variant: "destructive"
          });
          setIsLoading(false);
          return;
        }
        
        // Set horoscope data
        setHoroscope(aztroData.description);
        setLuckyColor(aztroData.color);
        setLuckyTime(aztroData.lucky_time);
        setMood(aztroData.mood);
        
        // Parse lucky numbers
        const luckyNumbersFromApi = aztroData.lucky_number.split(',').map((num: string) => parseInt(num.trim(), 10));
        setLuckyNumbers(luckyNumbersFromApi.filter((num: number) => !isNaN(num)));
        
        setCompatibleSigns([aztroData.compatibility]);
        
        // Generate weekly horoscope
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weeklyTexts = weekdays.map(day => {
          const seed = zodiacSign.name + day;
          let hash = 0;
          for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
          }
          
          // Create more diverse and detailed weekly horoscopes
          const energyLevel = 30 + Math.abs(hash % 70);
          const activities = [
            "connecting with close friends",
            "focusing on career advancements",
            "practicing mindfulness",
            "exploring creative outlets",
            "organizing your personal space",
            "learning something new",
            "spending time in nature"
          ];
          const challenges = [
            "communication misunderstandings",
            "unexpected delays",
            "decision paralysis",
            "emotional sensitivity",
            "restlessness",
            "overthinking",
            "external pressures"
          ];
          
          const activityIndex = Math.abs(hash % activities.length);
          const challengeIndex = Math.abs((hash >> 3) % challenges.length);
          
          return `${day}: Your energy levels will be around ${energyLevel}%. ${
            hash % 2 === 0 
              ? `This is an excellent day for ${activities[activityIndex]}.` 
              : `You might face some challenges related to ${challenges[challengeIndex]}.`
          } ${
            hash % 3 === 0
              ? `Your lucky color is ${aztroData.color}. Wear it for an extra boost.`
              : `Pay attention to opportunities during ${aztroData.lucky_time}.`
          }`;
        });
        
        setWeeklyHoroscope(weeklyTexts);
        
        // Calculate current moon phase
        const moonPhases = [
          'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
          'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
        ];
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
        const phaseIndex = Math.floor((dayOfYear % 29.5) / 3.7);
        setMoonPhase(moonPhases[phaseIndex]);
        
        // Calculate energy levels
        const moodEnergyMap: Record<string, number> = {
          'happy': 85, 'cheerful': 90, 'energetic': 95,
          'calm': 60, 'content': 70, 'relaxed': 65,
          'tired': 40, 'busy': 75, 'mixed': 55,
          'sad': 35, 'anxious': 45, 'stressed': 50
        };
        
        const normalizedMood = aztroData.mood.toLowerCase();
        let moodEnergy = 65;
        
        for (const [mood, energy] of Object.entries(moodEnergyMap)) {
          if (normalizedMood.includes(mood)) {
            moodEnergy = energy;
            break;
          }
        }
        
        const dateHash = today.getDate() + today.getMonth() * 30;
        const physicalOffset = (dateHash % 20) - 10;
        const mentalOffset = ((dateHash * 7) % 20) - 10;
        
        setEnergyLevels({
          emotional: moodEnergy,
          physical: Math.min(Math.max(moodEnergy + physicalOffset, 30), 95),
          mental: Math.min(Math.max(moodEnergy + mentalOffset, 30), 95)
        });
        
        toast({
          title: "Horoscope Ready",
          description: `Your ${zodiacSign.name} horoscope has been prepared!`,
        });
      } catch (error) {
        console.error("Error fetching horoscope data:", error);
        toast({
          title: "Error",
          description: "Failed to load your personalized horoscope. The stars are being shy today.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Could not determine your zodiac sign. Please check your birth date.",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  // Reset horoscope and clear saved birth date
  const resetHoroscope = () => {
    setSign(null);
    setHoroscope(null);
    setWeeklyHoroscope(null);
    localStorage.removeItem('zodiac_birth_day');
    localStorage.removeItem('zodiac_birth_month');
  };
  
  // Toggle favorite status for the current sign
  const handleToggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your favorite zodiac signs",
        variant: "default"
      });
      return;
    }
    
    if (!sign) return;
    
    try {
      const result = await saveFavoriteSign(sign);
      setIsFavorite(result);
      
      toast({
        title: result ? "Added to favorites" : "Removed from favorites",
        description: result ? `${sign} added to your favorites` : `${sign} removed from your favorites`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update your favorites",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="card-glass w-full max-w-[600px] p-6 animate-fade-in">
      <h2 className="text-2xl font-display font-semibold mb-4 flex items-center gap-2">
        <Sparkles size={24} className="text-zodiac-stardust-gold" />
        Your Personal Horoscope
      </h2>
      
      {!sign ? (
        <BirthDateForm onSubmit={handleBirthDateSubmit} isLoading={isLoading} />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <HoroscopeContent
              sign={sign}
              month={month}
              day={day}
              horoscope={horoscope}
              weeklyHoroscope={weeklyHoroscope}
              luckyNumbers={luckyNumbers}
              luckyColor={luckyColor}
              luckyTime={luckyTime}
              compatibleSigns={compatibleSigns}
              mood={mood}
              moonPhase={moonPhase}
              energyLevels={energyLevels}
              isLoading={isLoading}
            />
          </div>
          
          <div className="flex gap-3 mt-4">
            <Button 
              variant="outline" 
              onClick={resetHoroscope}
              className="flex-1"
            >
              Try Another Birth Date
            </Button>
            
            {user && (
              <Button
                variant="outline"
                onClick={handleToggleFavorite}
                className={`${isFavorite ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300' : ''}`}
              >
                <Star className={`mr-2 h-4 w-4 ${isFavorite ? 'fill-amber-500 text-amber-500' : ''}`} />
                {isFavorite ? 'Favorited' : 'Add to Favorites'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalHoroscope;
