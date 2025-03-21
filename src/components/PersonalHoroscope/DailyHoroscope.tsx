
import React from 'react';
import { Calendar } from 'lucide-react';
import { formatDate } from '@/utils/dateUtils';

interface DailyHoroscopeProps {
  horoscope: string | null;
  mood?: string;
}

const DailyHoroscope: React.FC<DailyHoroscopeProps> = ({ horoscope, mood }) => {
  return (
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
  );
};

export default DailyHoroscope;
