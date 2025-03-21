
import React from 'react';
import { Calendar, ArrowLeft, ArrowRight } from 'lucide-react';

interface WeeklyHoroscopeProps {
  weeklyHoroscope: string[] | null;
}

const WeeklyHoroscope: React.FC<WeeklyHoroscopeProps> = ({ weeklyHoroscope }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);
  
  if (!weeklyHoroscope || weeklyHoroscope.length === 0) {
    return <div className="text-white/50 italic">Weekly horoscope not available</div>;
  }
  
  const handlePrevious = () => {
    setActiveIndex((prev) => (prev === 0 ? weeklyHoroscope.length - 1 : prev - 1));
  };
  
  const handleNext = () => {
    setActiveIndex((prev) => (prev === weeklyHoroscope.length - 1 ? 0 : prev + 1));
  };
  
  return (
    <div className="space-y-4">
      <div className="bg-white/5 rounded-lg p-4 mb-3">
        <p className="text-white/90">{weeklyHoroscope[activeIndex]}</p>
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <button 
          onClick={handlePrevious}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Previous day"
        >
          <ArrowLeft size={18} />
        </button>
        
        <div className="flex space-x-1">
          {weeklyHoroscope.map((_, index) => (
            <div 
              key={index}
              className={`w-2 h-2 rounded-full ${index === activeIndex ? 'bg-zodiac-stardust-gold' : 'bg-white/30'}`}
            />
          ))}
        </div>
        
        <button 
          onClick={handleNext}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Next day"
        >
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default WeeklyHoroscope;
