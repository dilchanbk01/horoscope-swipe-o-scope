
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Activity } from 'lucide-react';

interface EnergyLevelsProps {
  mental: number;
  physical: number;
  emotional: number;
}

const EnergyLevels: React.FC<EnergyLevelsProps> = ({
  mental,
  physical,
  emotional
}) => {
  return (
    <div className="bg-white/5 rounded-lg p-4">
      <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
        <Activity size={18} className="text-zodiac-stardust-gold" />
        Energy Levels
      </h4>
      
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/70">Mental Energy</span>
            <span className="text-white/90">{mental}%</span>
          </div>
          <Progress value={mental} className="h-2 bg-white/10" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/70">Physical Energy</span>
            <span className="text-white/90">{physical}%</span>
          </div>
          <Progress value={physical} className="h-2 bg-white/10" />
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/70">Emotional Energy</span>
            <span className="text-white/90">{emotional}%</span>
          </div>
          <Progress value={emotional} className="h-2 bg-white/10" />
        </div>
      </div>
    </div>
  );
};

export default EnergyLevels;
