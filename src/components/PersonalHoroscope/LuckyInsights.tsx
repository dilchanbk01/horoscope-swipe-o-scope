
import React from 'react';
import { Star, Clock, Moon } from 'lucide-react';

interface LuckyInsightsProps {
  luckyNumbers: number[];
  luckyColor: string;
  luckyTime: string;
  moonPhase: string;
  mood: string;
}

const LuckyInsights: React.FC<LuckyInsightsProps> = ({
  luckyNumbers,
  luckyColor,
  luckyTime,
  moonPhase,
  mood
}) => {
  return (
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
        
        {mood && (
          <div>
            <p className="text-sm text-white/70 mb-1">Today's Mood</p>
            <span className="bg-zodiac-mystic-purple/30 text-white px-3 py-1 rounded-full text-sm">
              {mood}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default LuckyInsights;
