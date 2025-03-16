
import React, { useState } from 'react';
import { getZodiacSignByBirthday, getRandomHoroscope, generateWeeklyHoroscope } from '../utils/zodiacData';
import { validateDate, getMonthName } from '../utils/dateUtils';
import { formatDate } from '../utils/dateUtils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Sparkles } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const PersonalHoroscope: React.FC = () => {
  const [day, setDay] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [sign, setSign] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string | null>(null);
  const [weeklyHoroscope, setWeeklyHoroscope] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
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
    
    setError(null);
    const zodiacSign = getZodiacSignByBirthday(monthNum, dayNum);
    
    if (zodiacSign) {
      setSign(zodiacSign.name);
      setHoroscope(getRandomHoroscope(zodiacSign.name));
      setWeeklyHoroscope(generateWeeklyHoroscope(zodiacSign.name));
    } else {
      setError('Could not determine your zodiac sign');
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
          
          <Button type="submit" className="w-full bg-zodiac-mystic-purple hover:bg-zodiac-mystic-purple/80">
            Reveal My Horoscope
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
          
          <Tabs defaultValue="daily" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
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
              </TabsContent>
              <TabsContent value="weekly" className="mt-4 space-y-4">
                {weeklyHoroscope?.map((daily, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-4 mb-3">
                    <p className="text-white/90">{daily}</p>
                  </div>
                ))}
              </TabsContent>
            </ScrollArea>
          </Tabs>
          
          <Button 
            variant="outline" 
            onClick={() => {
              setSign(null);
              setHoroscope(null);
              setWeeklyHoroscope(null);
              setDay('');
              setMonth('');
            }}
            className="w-full border-white/20 text-white/80 hover:bg-white/10"
          >
            Enter New Birthday
          </Button>
        </div>
      )}
    </div>
  );
};

export default PersonalHoroscope;
