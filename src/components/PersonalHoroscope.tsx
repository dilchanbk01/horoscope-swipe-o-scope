
import React, { useState, useEffect } from 'react';
import { getZodiacSignByBirthday } from '../utils/zodiacData';
import { validateDate, getMonthName, formatDate } from '../utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Sparkles, Star, Moon, Sun, Activity } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchDailyHoroscope } from '@/services/horoscopeApi';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';

const PersonalHoroscope: React.FC = () => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [sign, setSign] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [weeklyHoroscope, setWeeklyHoroscope] = useState<string[] | null>(null);
  const [luckyNumbers, setLuckyNumbers] = useState<number[]>([]);
  const [luckyColor, setLuckyColor] = useState<string>('');
  const [compatibleSigns, setCompatibleSigns] = useState<string[]>([]);
  const [moonPhase, setMoonPhase] = useState<string>('');
  const [energyLevels, setEnergyLevels] = useState<{
    mental: number;
    physical: number;
    emotional: number;
  }>({ mental: 0, physical: 0, emotional: 0 });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  
  const months = [
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];
  
  // Check localStorage on initial load
  useEffect(() => {
    const savedDay = localStorage.getItem('zodiac_birth_day');
    const savedMonth = localStorage.getItem('zodiac_birth_month');
    
    if (savedDay && savedMonth) {
      setDay(savedDay);
      setMonth(savedMonth);
      handleBirthDateSubmit(savedDay, savedMonth);
    }
  }, []);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    
    if (!day || !month) {
      setError('Please enter your birth day and month');
      return;
    }
    
    if (!validateDate(dayNum, monthNum)) {
      setError('Please enter a valid date');
      return;
    }
    
    // Save to localStorage
    localStorage.setItem('zodiac_birth_day', day);
    localStorage.setItem('zodiac_birth_month', month);
    
    handleBirthDateSubmit(day, month);
  };

  // Generate deterministic "random" values based on date and sign
  const generateDeterministicValues = (signName: string) => {
    const today = new Date();
    const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
    const seed = signName + dateString;
    
    // Function to generate a seeded random number
    const seededRandom = (max: number, offset = 0) => {
      let hash = 0;
      for (let i = 0; i < seed.length; i++) {
        hash = ((hash << 5) - hash) + seed.charCodeAt(i) + offset;
        hash |= 0;
      }
      return Math.abs(hash % max);
    };
    
    // Generate lucky numbers (1-99)
    const numbers: number[] = [];
    for (let i = 0; i < 3; i++) {
      numbers.push(seededRandom(99, i) + 1);
    }
    
    // Generate a lucky color
    const colors = [
      'Emerald Green', 'Royal Blue', 'Ruby Red', 'Amethyst Purple', 
      'Topaz Yellow', 'Turquoise', 'Rose Gold', 'Silver', 'Gold', 
      'Sapphire Blue', 'Jade Green', 'Amber Orange'
    ];
    const color = colors[seededRandom(colors.length)];
    
    // Generate compatible signs (3 of them)
    const allSigns = [
      'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
      'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
    ];
    const filteredSigns = allSigns.filter(s => s !== signName);
    const compatibles: string[] = [];
    for (let i = 0; i < 3; i++) {
      const index = seededRandom(filteredSigns.length, i);
      compatibles.push(filteredSigns[index]);
    }
    
    // Generate moon phase
    const moonPhases = [
      'New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous',
      'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent'
    ];
    const phase = moonPhases[seededRandom(moonPhases.length)];
    
    // Generate energy levels
    const mental = seededRandom(40, 1) + 40;  // 40-80 range
    const physical = seededRandom(60, 2) + 30; // 30-90 range
    const emotional = seededRandom(50, 3) + 30; // 30-80 range
    
    return {
      luckyNumbers: numbers,
      luckyColor: color,
      compatibleSigns: compatibles,
      moonPhase: phase,
      energyLevels: { mental, physical, emotional }
    };
  };
  
  const handleBirthDateSubmit = async (day: string, month: string) => {
    setIsLoading(true);
    setError(null);
    
    const dayNum = parseInt(day, 10);
    const monthNum = parseInt(month, 10);
    
    const zodiacSign = getZodiacSignByBirthday(monthNum, dayNum);
    
    if (zodiacSign) {
      setSign(zodiacSign.name);
      
      try {
        // Fetch personalized horoscope - now faster with our updated API
        const horoscopeText = await fetchDailyHoroscope(zodiacSign.name);
        setHoroscope(horoscopeText);
        
        // Generate deterministic personalized data
        const {
          luckyNumbers,
          luckyColor,
          compatibleSigns,
          moonPhase,
          energyLevels
        } = generateDeterministicValues(zodiacSign.name);
        
        setLuckyNumbers(luckyNumbers);
        setLuckyColor(luckyColor);
        setCompatibleSigns(compatibleSigns);
        setMoonPhase(moonPhase);
        setEnergyLevels(energyLevels);
        
        // Generate weekly horoscope
        const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const weeklyTexts = weekdays.map(day => {
          // Create slightly different texts for each day using deterministic method
          const seed = zodiacSign.name + day;
          let hash = 0;
          for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
          }
          const dayIndex = Math.abs(hash % 3); // Use this to pick one of three variations
          
          return `${day}: ${horoscopeText.split('.')[dayIndex % horoscopeText.split('.').length]}. ${
            hash % 2 === 0 
              ? "Your intuition is especially strong today." 
              : "Focus on self-care and balance."
          }`;
        });
        
        setWeeklyHoroscope(weeklyTexts);
        
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
      setError('Could not determine your zodiac sign');
      setIsLoading(false);
    }
  };
  
  return (
    <div className="card-glass w-full max-w-[600px] p-6 animate-fade-in">
      <h2 className="text-2xl font-display font-semibold mb-4 flex items-center gap-2">
        <Sparkles size={24} className="text-zodiac-stardust-gold" />
        Your Personal Horoscope
      </h2>
      
      {!sign ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-white/70">Enter your birth date to discover your zodiac sign and personal horoscope.</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="month" className="block text-sm font-medium text-white/80 mb-1">
                Birth Month
              </label>
              <select
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-zodiac-mystic-purple"
              >
                <option value="">Select Month</option>
                {months.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="day" className="block text-sm font-medium text-white/80 mb-1">
                Birth Day
              </label>
              <input
                id="day"
                type="number"
                min="1"
                max="31"
                value={day}
                onChange={(e) => setDay(e.target.value)}
                placeholder="Day"
                className="w-full bg-white/10 border border-white/20 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-zodiac-mystic-purple"
              />
            </div>
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <Button 
            type="submit" 
            className="w-full bg-zodiac-mystic-purple hover:bg-zodiac-mystic-purple/80"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Reveal My Horoscope"}
          </Button>
        </form>
      ) : (
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-zodiac-mystic-purple/20 text-zodiac-mystic-purple text-xl">
              {sign.charAt(0)}
            </div>
            <div>
              <h3 className="text-xl font-semibold">{sign}</h3>
              <p className="text-white/70">
                {month && day ? `${getMonthName(parseInt(month, 10))} ${day}` : ''}
              </p>
            </div>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              <div className="animate-pulse h-4 bg-white/5 rounded-md w-1/4"></div>
              <div className="animate-pulse h-32 bg-white/5 rounded-md"></div>
            </div>
          ) : (
            <Tabs defaultValue="daily" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
              </TabsList>
              <ScrollArea className="h-[400px] mt-4">
                <TabsContent value="daily" className="mt-4 space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-sm text-white/70 mb-2">
                      <Calendar size={16} />
                      <span>{formatDate(new Date())}</span>
                    </div>
                    <p className="text-white/90">{horoscope}</p>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Star size={18} className="text-zodiac-stardust-gold" />
                      Today's Cosmic Insights
                    </h4>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-white/70 mb-1">Lucky Numbers</p>
                        <div className="flex gap-2">
                          {luckyNumbers.map((num, i) => (
                            <span key={i} className="bg-zodiac-mystic-purple/30 text-white px-3 py-1 rounded-full text-sm">
                              {num}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-white/70 mb-1">Lucky Color</p>
                        <span className="bg-zodiac-mystic-purple/30 text-white px-3 py-1 rounded-full text-sm">
                          {luckyColor}
                        </span>
                      </div>
                      
                      <div>
                        <p className="text-sm text-white/70 mb-1">Moon Phase</p>
                        <div className="flex items-center gap-2">
                          <Moon size={16} className="text-white/80" />
                          <span>{moonPhase}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Activity size={18} className="text-zodiac-stardust-gold" />
                      Energy Levels
                    </h4>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Mental Energy</span>
                          <span className="text-white/90">{energyLevels.mental}%</span>
                        </div>
                        <Progress value={energyLevels.mental} className="h-2 bg-white/10" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Physical Energy</span>
                          <span className="text-white/90">{energyLevels.physical}%</span>
                        </div>
                        <Progress value={energyLevels.physical} className="h-2 bg-white/10" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">Emotional Energy</span>
                          <span className="text-white/90">{energyLevels.emotional}%</span>
                        </div>
                        <Progress value={energyLevels.emotional} className="h-2 bg-white/10" />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="weekly" className="mt-4 space-y-4">
                  {weeklyHoroscope?.map((daily, index) => (
                    <div key={index} className="bg-white/5 rounded-lg p-4 mb-3">
                      <p className="text-white/90">{daily}</p>
                    </div>
                  ))}
                </TabsContent>
                
                <TabsContent value="insights" className="mt-4 space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                      <Sun size={18} className="text-zodiac-stardust-gold" />
                      Compatible Signs
                    </h4>
                    
                    <p className="text-sm text-white/70 mb-3">
                      These signs align well with your cosmic energy today:
                    </p>
                    
                    <div className="flex flex-wrap gap-2">
                      {compatibleSigns.map((compatSign, index) => (
                        <span key={index} className="bg-zodiac-mystic-purple/30 text-white px-3 py-1 rounded-full text-sm">
                          {compatSign}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-lg font-medium mb-3">Sign Characteristics</h4>
                    
                    <div className="space-y-2">
                      <p className="text-sm"><strong>Element:</strong> {sign === "Aries" || sign === "Leo" || sign === "Sagittarius" 
                        ? "Fire" 
                        : sign === "Taurus" || sign === "Virgo" || sign === "Capricorn"
                        ? "Earth"
                        : sign === "Gemini" || sign === "Libra" || sign === "Aquarius"
                        ? "Air" 
                        : "Water"}</p>
                        
                      <p className="text-sm"><strong>Quality:</strong> {sign === "Aries" || sign === "Cancer" || sign === "Libra" || sign === "Capricorn" 
                        ? "Cardinal" 
                        : sign === "Taurus" || sign === "Leo" || sign === "Scorpio" || sign === "Aquarius"
                        ? "Fixed"
                        : "Mutable"}</p>
                        
                      <p className="text-sm"><strong>Ruling Planet:</strong> {
                        sign === "Aries" ? "Mars" :
                        sign === "Taurus" ? "Venus" :
                        sign === "Gemini" ? "Mercury" :
                        sign === "Cancer" ? "Moon" :
                        sign === "Leo" ? "Sun" :
                        sign === "Virgo" ? "Mercury" :
                        sign === "Libra" ? "Venus" :
                        sign === "Scorpio" ? "Pluto" :
                        sign === "Sagittarius" ? "Jupiter" :
                        sign === "Capricorn" ? "Saturn" :
                        sign === "Aquarius" ? "Uranus" :
                        "Neptune"
                      }</p>
                    </div>
                  </div>
                </TabsContent>
              </ScrollArea>
            </Tabs>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => {
              setSign(null);
              setHoroscope(null);
              setWeeklyHoroscope(null);
              // We don't clear day/month to allow easy re-submission
            }}
            className="w-full border-white/20 text-white/80 hover:bg-white/10"
            disabled={isLoading}
          >
            Change Birthday
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalHoroscope;
