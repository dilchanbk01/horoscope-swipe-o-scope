
import React, { useState, useEffect } from 'react';
import { getZodiacSignByBirthday } from '@/utils/zodiacData';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import BirthDateForm from './BirthDateForm';
import HoroscopeContent from './HoroscopeContent';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

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
  const { toast } = useToast();
  
  useEffect(() => {
    const savedDay = localStorage.getItem('zodiac_birth_day');
    const savedMonth = localStorage.getItem('zodiac_birth_month');
    
    if (savedDay && savedMonth) {
      setDay(savedDay);
      setMonth(savedMonth);
      handleBirthDateSubmit(savedDay, savedMonth);
    }
  }, []);
  
  const handleBirthDateSubmit = async (day: string, month: string) => {
    setIsLoading(true);
    
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    
    const zodiacSign = getZodiacSignByBirthday(monthNum, dayNum);
    
    if (zodiacSign) {
      setSign(zodiacSign.name);
      
      try {
        const { data: aztroData, error: aztroError } = await supabase.functions.invoke("aztro-horoscope", {
          body: { sign: zodiacSign.name.toLowerCase(), day: "today" }
        });

        if (aztroError) {
          throw new Error(aztroError.message);
        }
        
        setHoroscope(aztroData.description);
        setLuckyColor(aztroData.color);
        setLuckyTime(aztroData.lucky_time);
        setMood(aztroData.mood);
        
        const luckyNumbersFromApi = aztroData.lucky_number.split(',').map((num: string) => parseInt(num.trim(), 10));
        setLuckyNumbers(luckyNumbersFromApi.filter((num: number) => !isNaN(num)));
        
        setCompatibleSigns([aztroData.compatibility]);
        
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weeklyTexts = weekdays.map(day => {
          const seed = zodiacSign.name + day;
          let hash = 0;
          for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
          }
          
          const sentences = aztroData.description.split('.');
          const sentenceIndex = Math.abs(hash % sentences.length);
          
          return `${day}: ${sentences[sentenceIndex] || sentences[0]}. ${
            hash % 2 === 0 
              ? `Your lucky color is ${aztroData.color}.` 
              : `Your lucky time is ${aztroData.lucky_time}.`
          }`;
        });
        
        setWeeklyHoroscope(weeklyTexts);
        
        const moonPhases = [
          'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
          'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
        ];
        const today = new Date();
        const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
        const phaseIndex = Math.floor((dayOfYear % 29.5) / 3.7);
        setMoonPhase(moonPhases[phaseIndex]);
        
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
          description: "Failed to load your personalized horoscope",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      toast({
        title: "Error",
        description: "Could not determine your zodiac sign",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };
  
  const resetHoroscope = () => {
    setSign(null);
    setHoroscope(null);
    setWeeklyHoroscope(null);
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
          
          <Button 
            variant="outline" 
            onClick={resetHoroscope}
            className="w-full mt-4"
          >
            Try Another Birth Date
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalHoroscope;
