
import React from 'react';
import { ZodiacSign } from '../utils/zodiacData';

interface ZodiacInfoProps {
  sign: ZodiacSign;
}

const ZodiacInfo: React.FC<ZodiacInfoProps> = ({ sign }) => {
  return (
    <div className="card-glass w-full max-w-[600px] p-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center text-4xl"
          style={{ backgroundColor: sign.color + '20', color: sign.color }}
        >
          {sign.symbol}
        </div>
        <div>
          <h2 className="text-3xl font-display font-semibold">{sign.name}</h2>
          <p className="text-white/70">{sign.dateRange}</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-sm text-white/70 mb-1">Element</h3>
          <p className="text-lg">{sign.element}</p>
        </div>
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-sm text-white/70 mb-1">Planet</h3>
          <p className="text-lg">{sign.planet}</p>
        </div>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-medium mb-2">About {sign.name}</h3>
          <p className="text-white/80 leading-relaxed">{sign.description}</p>
        </div>
        
        <div>
          <h3 className="text-xl font-medium mb-2">Key Traits</h3>
          <div className="flex flex-wrap gap-2">
            {sign.traits.map((trait, index) => (
              <span 
                key={index} 
                className="px-3 py-1 rounded-full bg-white/10 text-sm"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-xl font-medium mb-2">Best Compatibility</h3>
          <div className="flex flex-wrap gap-2">
            {sign.compatibility.map((match, index) => (
              <span 
                key={index} 
                className="px-3 py-1 rounded-full bg-white/10 text-sm"
              >
                {match}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZodiacInfo;
