
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getMonthName } from '@/utils/dateUtils';
import DailyHoroscope from './DailyHoroscope';
import LuckyInsights from './LuckyInsights';
import EnergyLevels from './EnergyLevels';
import WeeklyHoroscope from './WeeklyHoroscope';
import CompatibleSigns from './CompatibleSigns';
import SignCharacteristics from './SignCharacteristics';

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
            <DailyHoroscope horoscope={horoscope} />
            
            <LuckyInsights 
              luckyNumbers={luckyNumbers}
              luckyColor={luckyColor}
              luckyTime={luckyTime}
              moonPhase={moonPhase}
              mood={mood}
            />
            
            <EnergyLevels 
              mental={energyLevels.mental}
              physical={energyLevels.physical}
              emotional={energyLevels.emotional}
            />
          </TabsContent>
          
          <TabsContent value="weekly" className="mt-4">
            <WeeklyHoroscope weeklyHoroscope={weeklyHoroscope} />
          </TabsContent>
          
          <TabsContent value="insights" className="mt-4 space-y-4">
            <CompatibleSigns compatibleSigns={compatibleSigns} />
            <SignCharacteristics sign={sign} />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
};

export default HoroscopeContent;
