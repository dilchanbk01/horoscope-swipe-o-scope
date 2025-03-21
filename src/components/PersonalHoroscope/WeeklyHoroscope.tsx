
import React from 'react';

interface WeeklyHoroscopeProps {
  weeklyHoroscope: string[] | null;
}

const WeeklyHoroscope: React.FC<WeeklyHoroscopeProps> = ({ weeklyHoroscope }) => {
  if (!weeklyHoroscope || weeklyHoroscope.length === 0) {
    return <div className="text-white/50 italic">Weekly horoscope not available</div>;
  }
  
  return (
    <div className="space-y-4">
      {weeklyHoroscope.map((daily, index) => (
        <div key={index} className="bg-white/5 rounded-lg p-4 mb-3">
          <p className="text-white/90">{daily}</p>
        </div>
      ))}
    </div>
  );
};

export default WeeklyHoroscope;
