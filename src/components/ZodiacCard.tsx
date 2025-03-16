
import React from 'react';
import { ZodiacSign } from '../utils/zodiacData';
import { ArrowLeft, ArrowRight, Heart, X } from 'lucide-react';

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
        
        {/* Card body */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="mb-4">
            <h3 className="text-lg text-white/90 font-medium mb-2">Today's Horoscope</h3>
            <p className="text-white/80">{sign.dailyHoroscope}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg text-white/90 font-medium mb-2">About {sign.name}</h3>
            <p className="text-white/80">{sign.description}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg text-white/90 font-medium mb-2">Traits</h3>
            <div className="flex flex-wrap gap-2">
              {sign.traits.map((trait, index) => (
                <span key={index} className="px-3 py-1 rounded-full bg-white/10 text-xs">
                  {trait}
                </span>
              ))}
            </div>
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
