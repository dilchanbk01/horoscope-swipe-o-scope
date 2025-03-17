
import React, { useEffect, useRef, useState } from 'react';
import { ZodiacSign } from '../utils/zodiacData';
import { ArrowLeft, ArrowRight, Heart, X, Battery } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { fetchDailyHoroscope, getSocialEnergyLevel, saveFavoriteSign, isSignFavorited } from '@/services/horoscopeApi';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ZodiacCardProps {
  sign: ZodiacSign;
  style?: React.CSSProperties;
  isActive?: boolean;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  key?: string | number;
}

const ZodiacCard: React.FC<ZodiacCardProps> = ({
  sign,
  style,
  isActive = false,
  onSwipeLeft,
  onSwipeRight,
  key
}) => {
  const [dailyHoroscope, setDailyHoroscope] = useState<string>(sign.dailyHoroscope);
  const [socialEnergyLevel, setSocialEnergyLevel] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Fetch personalized data when sign changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch daily horoscope
        const horoscope = await fetchDailyHoroscope(sign.name);
        setDailyHoroscope(horoscope);
        
        // Get social energy level
        const energyLevel = await getSocialEnergyLevel(sign.name);
        setSocialEnergyLevel(energyLevel);
        
        // Check if sign is favorited by user
        if (user) {
          const favorited = await isSignFavorited(sign.name);
          setIsFavorite(favorited);
        }
      } catch (error) {
        console.error("Error fetching zodiac data:", error);
        toast({
          title: "Error",
          description: "Failed to load your personalized horoscope",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
    
    // Reset scroll position when sign changes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [sign, user, toast]);
  
  // Toggle favorite status
  const handleFavoriteToggle = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save your favorite zodiac signs",
        variant: "default"
      });
      return;
    }
    
    try {
      const result = await saveFavoriteSign(sign.name);
      setIsFavorite(result);
      
      toast({
        title: result ? "Added to favorites" : "Removed from favorites",
        description: result ? `${sign.name} added to your favorites` : `${sign.name} removed from your favorites`,
        variant: "default"
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast({
        title: "Error",
        description: "Failed to update your favorites",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div
      className={`card-glass flex flex-col h-full ${isActive ? 'z-10 card-appear' : 'z-0'}`}
      style={style}
      key={key}
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
          <div className="p-6" ref={scrollRef}>
            <div className="mb-6">
              <h3 className="text-lg text-white/90 font-medium mb-2">Today's Horoscope</h3>
              {isLoading ? (
                <div className="animate-pulse h-20 bg-white/5 rounded-md"></div>
              ) : (
                <p className="text-white/80">{dailyHoroscope}</p>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg text-white/90 font-medium mb-2">Social Energy</h3>
              <div className="flex items-center gap-3 mb-2">
                <Battery size={20} className="text-zodiac-stardust-gold" />
                <span className="text-sm text-white/80">
                  {isLoading ? "Loading..." : `${socialEnergyLevel}% Social Energy`}
                </span>
              </div>
              
              {isLoading ? (
                <div className="animate-pulse h-2 bg-white/5 rounded-md"></div>
              ) : (
                <Progress value={socialEnergyLevel} className="h-2 bg-white/10" />
              )}
              
              <p className="mt-2 text-sm text-white/70">
                {isLoading ? (
                  <div className="animate-pulse h-10 bg-white/5 rounded-md mt-2"></div>
                ) : (
                  socialEnergyLevel > 70 
                    ? "High social energy today! Great time for gatherings and connections." 
                    : socialEnergyLevel > 40 
                      ? "Moderate social energy. Balance social time with personal space."
                      : "Lower social energy today. Consider quiet activities and self-care."
                )}
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
            onClick={handleFavoriteToggle}
            className={`p-3 rounded-full ${isFavorite ? 'bg-pink-500/30 text-pink-300' : 'bg-white/10'} hover:bg-white/20 transition-colors`}
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart size={20} className={isFavorite ? 'fill-pink-500 text-pink-500' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZodiacCard;
