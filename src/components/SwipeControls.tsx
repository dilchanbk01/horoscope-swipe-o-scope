
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SwipeControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  currentIndex: number;
  total: number;
}

const SwipeControls: React.FC<SwipeControlsProps> = ({
  onPrevious,
  onNext,
  currentIndex,
  total
}) => {
  return (
    <div className="flex items-center justify-between w-full max-w-[600px] mt-6">
      <button
        onClick={onPrevious}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label="Previous sign"
      >
        <ChevronLeft size={24} />
      </button>
      
      <div className="flex items-center gap-1">
        {Array.from({ length: total }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-white w-4' : 'bg-white/30'
            }`}
          />
        ))}
      </div>
      
      <button
        onClick={onNext}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
        aria-label="Next sign"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
};

export default SwipeControls;
