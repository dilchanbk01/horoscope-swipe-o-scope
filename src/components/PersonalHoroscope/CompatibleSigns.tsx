
import React from 'react';
import { Sun } from 'lucide-react';

interface CompatibleSignsProps {
  compatibleSigns: string[];
}

const CompatibleSigns: React.FC<CompatibleSignsProps> = ({ compatibleSigns }) => {
  return (
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
  );
};

export default CompatibleSigns;
