
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Calendar, Sparkles, Star, Moon, Sun, Activity, Clock } from 'lucide-react';
import { formatDate, getMonthName } from '@/utils/dateUtils';

interface EnergyLevels {
  mental: number;
  physical: number;
  emotional: number;
}

interface HoroscopeContentProps {
  sign: string;
  month: string;
  day: string;
  horoscope: string | null;
  weeklyHoroscope: string[] | null;
  luckyNumbers: number[];
  luckyColor: string;
  luckyTime: string;
  compatibleSigns: string[];
  mood: string;
  moonPhase: string;
  energyLevels: EnergyLevels;
  isLoading: boolean;
}

const HoroscopeContent: React.FC<HoroscopeContentProps> = ({
  sign,
  month,
  day,
  horoscope,
  weeklyHoroscope,
  luckyNumbers,
  luckyColor,
  luckyTime,
  compatibleSigns,
  mood,
  moonPhase,
  energyLevels,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse h-4 bg-white/5 rounded-md w-1/4"></div>
        <div className="animate-pulse h-32 bg-white/5 rounded-md"></div>
      </div>
    );
  }
  
  return (
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
              
              {mood && (
                <div className="mt-3 flex items-center gap-2 text-sm">
                  <span className="text-white/70">Today's Mood:</span>
                  <span className="bg-zodiac-mystic-purple/30 text-white px-3 py-1 rounded-full text-sm">
                    {mood}
                  </span>
                </div>
              )}
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
                <Star size={18} className="text-zodiac-stardust-gold" />
                Today's Cosmic Insights
              </h4>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-white/70 mb-1">Lucky Numbers</p>
                  <div className="flex flex-wrap gap-2">
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
                  <p className="text-sm text-white/70 mb-1">Lucky Time</p>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-white/80" />
                    <span className="bg-zodiac-mystic-purple/30 text-white px-3 py-1 rounded-full text-sm">
                      {luckyTime}
                    </span>
                  </div>
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
    </div>
  );
};

export default HoroscopeContent;
