
import React from 'react';
import { ZodiacSign } from '../utils/zodiacData';
import { ArrowLeft, ArrowRight, Heart, X, Battery } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ZodiacCardProps {
  sign: ZodiacSign;
  style?: React.CSSProperties;
  isActive?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

const ZodiacCard: React.FC<ZodiacCardProps> = ({
  sign,
  style,
  isActive = false,
  onSwipeLeft,
  onSwipeRight
}) => {
  // Calculate social energy level (random value between 30-100 for demo purposes)
  const socialEnergyLevel = Math.floor(Math.random() * 70) + 30;
  
  return (
    <div
      className={`card-glass flex flex-col h-full ${isActive ? 'z-10' : 'z-0'}`}
      style={style}
    >
      {/* Swipe indicators */}
      <div className={`swipe-indicator left ${isActive ? 'swipe-active' : ''}`}>
        <X size={36} className="text-destructive" />
      </div>
      <div className={`swipe-indicator right ${isActive ? 'swipe-active' : ''}`}>
        <Heart size={36} className="text-pink-500" />
      </div>

      {/* Card content */}
      <div className="flex flex-col h-full">
        {/* Card header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center text-3xl"
              style={{ backgroundColor: sign.color + '20', color: sign.color }}
            >
              {sign.symbol}
            </div>
            <div>
              <h2 className="text-2xl font-display font-semibold">{sign.name}</h2>
              <p className="text-sm text-white/70">{sign.dateRange}</p>
            </div>
          </div>
          <div className="px-3 py-1 rounded-full bg-white/10 text-xs">
            {sign.element}
          </div>
        </div>
        
        {/* Card body - with ScrollArea for better scrolling */}
        <ScrollArea className="flex-1">
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-lg text-white/90 font-medium mb-2">Today's Horoscope</h3>
              <p className="text-white/80">{sign.dailyHoroscope}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg text-white/90 font-medium mb-2">Social Energy</h3>
              <div className="flex items-center gap-3 mb-2">
                <Battery size={20} className="text-zodiac-stardust-gold" />
                <span className="text-sm text-white/80">{socialEnergyLevel}% Social Energy</span>
              </div>
              <Progress value={socialEnergyLevel} className="h-2 bg-white/10" />
              <p className="mt-2 text-sm text-white/70">
                {socialEnergyLevel > 70 
                  ? "High social energy today! Great time for gatherings and connections." 
                  : socialEnergyLevel > 40 
                    ? "Moderate social energy. Balance social time with personal space."
                    : "Lower social energy today. Consider quiet activities and self-care."}
              </p>
            </div>
            
            <div>
              <h3 className="text-lg text-white/90 font-medium mb-2">Best Compatibility</h3>
              <div className="flex flex-wrap gap-2">
                {sign.compatibility.map((match, index) => (
                  <span key={index} className="px-3 py-1 rounded-full bg-white/10 text-xs">
                    {match}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>
        
        {/* Card footer */}
        <div className="p-4 border-t border-white/10 flex justify-between">
          <button 
            onClick={onSwipeLeft}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Dislike"
          >
            <X size={20} />
          </button>
          
          <button 
            onClick={onSwipeRight}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Like"
          >
            <Heart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZodiacCard;
