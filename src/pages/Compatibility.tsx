
import React, { useState } from 'react';
import { zodiacSigns } from '@/utils/zodiacData';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';

const CompatibilityPage = () => {
  const [firstSign, setFirstSign] = useState<string>('');
  const [secondSign, setSecondSign] = useState<string>('');
  const [compatibility, setCompatibility] = useState<{
    percentage: number;
    description: string;
  } | null>(null);

  const generateCompatibility = () => {
    if (!firstSign || !secondSign) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select both zodiac signs",
      });
      return;
    }

    // Get the selected signs from the zodiac data
    const sign1 = zodiacSigns.find(sign => sign.name === firstSign);
    const sign2 = zodiacSigns.find(sign => sign.name === secondSign);

    if (!sign1 || !sign2) return;

    // Check if they're compatible based on the compatibility array
    const isCompatible = sign1.compatibility.includes(secondSign);
    const isReverseCompatible = sign2.compatibility.includes(firstSign);

    // Generate a compatibility percentage
    let percentage = Math.floor(Math.random() * 40) + 30; // Base compatibility (30-70%)
    
    if (isCompatible && isReverseCompatible) {
      percentage += 30; // High compatibility (60-100%)
    } else if (isCompatible || isReverseCompatible) {
      percentage += 15; // Medium compatibility (45-85%)
    }

    // Cap at 100%
    percentage = Math.min(percentage, 100);

    // Generate a description based on the percentage
    let description = '';
    if (percentage >= 90) {
      description = `${firstSign} and ${secondSign} share an extraordinary cosmic connection. Your energies harmonize beautifully, creating a relationship full of understanding and mutual growth. The stars shine brightly on this pairing!`;
    } else if (percentage >= 75) {
      description = `${firstSign} and ${secondSign} have a strong compatibility. Your elements complement each other well, and you'll find natural harmony in many aspects of your relationship. There's definite potential here!`;
    } else if (percentage >= 50) {
      description = `${firstSign} and ${secondSign} have a moderate compatibility. While you'll connect in some areas, you may find challenges in others. With understanding and communication, you can build a balanced relationship.`;
    } else {
      description = `${firstSign} and ${secondSign} may face some challenges in your relationship. Your elements and planetary influences create a complex dynamic. This doesn't mean it won't work, but you'll need patience and compromise.`;
    }

    setCompatibility({ percentage, description });
    
    toast({
      title: "Compatibility check complete!",
      description: `${firstSign} and ${secondSign} are ${percentage}% compatible`,
    });
  };

  return (
    <ScrollArea className="h-[calc(100vh-6rem)]">
      <div className="flex flex-col items-center justify-center min-h-fit py-8">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
            Zodiac Compatibility
          </h1>
          <p className="text-lg text-white/70 max-w-md mx-auto">
            Discover how compatible your sign is with others
          </p>
        </div>
        
        <div className="card-glass w-full max-w-[600px] p-6 animate-fade-in mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={24} className="text-zodiac-stardust-gold" />
            <h2 className="text-2xl font-display font-semibold">Check Compatibility</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="firstSign" className="block text-sm font-medium text-white/80 mb-2">
                First Sign
              </label>
              <select
                id="firstSign"
                value={firstSign}
                onChange={(e) => setFirstSign(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-zodiac-mystic-purple"
              >
                <option value="">Select Zodiac Sign</option>
                {zodiacSigns.map((sign) => (
                  <option key={sign.name} value={sign.name}>
                    {sign.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="secondSign" className="block text-sm font-medium text-white/80 mb-2">
                Second Sign
              </label>
              <select
                id="secondSign"
                value={secondSign}
                onChange={(e) => setSecondSign(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-zodiac-mystic-purple"
              >
                <option value="">Select Zodiac Sign</option>
                {zodiacSigns.map((sign) => (
                  <option key={sign.name} value={sign.name}>
                    {sign.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <Button 
            onClick={generateCompatibility} 
            className="w-full bg-zodiac-mystic-purple hover:bg-zodiac-mystic-purple/80"
          >
            <Heart size={18} className="mr-2" />
            Check Compatibility
          </Button>
          
          {compatibility && (
            <div className="mt-8 space-y-4 animate-fade-in">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Compatibility Score</h3>
                  <span className="text-xl font-bold text-zodiac-stardust-gold">{compatibility.percentage}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2 mb-2">
                  <div 
                    className="bg-gradient-to-r from-zodiac-mystic-purple to-zodiac-stardust-gold h-2 rounded-full"
                    style={{ width: `${compatibility.percentage}%` }}
                  />
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium mb-2">Compatibility Analysis</h3>
                <p className="text-white/80">{compatibility.description}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};

export default CompatibilityPage;
