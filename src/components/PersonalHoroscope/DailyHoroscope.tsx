
import React from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

interface DailyHoroscopeProps {
  horoscope: string | null;
  mood?: string;
}

const DailyHoroscope: React.FC<DailyHoroscopeProps> = ({ horoscope, mood }) => {
  if (!horoscope) {
    return (
      <div className="bg-white/5 rounded-lg p-4">
        <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
          <Calendar size={16} />
          <span>{formatDate(new Date())}</span>
          
          <div className="flex-1 flex justify-end">
            <Sparkles size={16} className="text-zodiac-stardust-gold mr-1" />
            <span className="text-zodiac-stardust-gold">Daily Cosmic Insights</span>
          </div>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-white/5 rounded-md w-3/4"></div>
          <div className="h-4 bg-white/5 rounded-md w-full"></div>
          <div className="h-4 bg-white/5 rounded-md w-5/6"></div>
          <div className="h-4 bg-white/5 rounded-md w-4/5"></div>
          <div className="h-4 bg-white/5 rounded-md w-3/4"></div>
        </div>
      </div>
    );
  }
  
  // Split the horoscope into multiple paragraphs to improve readability
  const paragraphs = horoscope.match(/(.{1,150})(?:\s|$)/g) || [];
  
  return (
    <div className="bg-white/5 rounded-lg p-5">
      <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
        <Calendar size={16} />
        <span>{formatDate(new Date())}</span>
        
        <div className="flex-1 flex justify-end">
          <Sparkles size={16} className="text-zodiac-stardust-gold mr-1" />
          <span className="text-zodiac-stardust-gold">Daily Cosmic Insights</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-white/90">{paragraph}</p>
        ))}
      </div>
      
      {mood && (
        <div className="mt-4 flex items-center gap-2 text-sm">
          <span className="text-white/70">Today's Mood:</span>
          <span className="bg-zodiac-mystic-purple/30 text-white px-3 py-1 rounded-full text-sm">
            {mood}
          </span>
        </div>
      )}
    </div>
  );
};

export default DailyHoroscope;
