
import React, { useEffect, useRef, useState } from 'react';
import { ZodiacSign } from '../utils/zodiacData';
import { ArrowLeft, ArrowRight, Battery } from 'lucide-react';
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
  isLoading?: boolean;
}

const ZodiacCard: React.FC<ZodiacCardProps> = ({
  sign,
  style,
  isActive = false,
  onSwipeLeft,
  onSwipeRight,
  isLoading: externalLoading = false
}) => {
  const [dailyHoroscope, setDailyHoroscope] = useState<string>(sign.dailyHoroscope);
  const [socialEnergyLevel, setSocialEnergyLevel] = useState<number>(50);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loadState, setLoadState] = useState<{horoscope: boolean, energy: boolean}>({
    horoscope: false,
    energy: false
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const isInitialMount = useRef(true);
  
  // Fetch personalized data when sign changes
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setLoadState({horoscope: false, energy: false});
      
      try {
        // Fetch daily horoscope
        fetchDailyHoroscope(sign.name)
          .then(horoscope => {
            setDailyHoroscope(horoscope);
            setLoadState(prev => ({...prev, horoscope: true}));
          })
          .catch(error => {
            console.error("Error fetching horoscope:", error);
            setLoadState(prev => ({...prev, horoscope: true}));
          });
        
        // Get social energy level in parallel
        getSocialEnergyLevel(sign.name)
          .then(energyLevel => {
            setSocialEnergyLevel(energyLevel);
            setLoadState(prev => ({...prev, energy: true}));
          })
          .catch(error => {
            console.error("Error fetching energy level:", error);
            setLoadState(prev => ({...prev, energy: true}));
          });
        
        // Check if sign is favorited by user
        if (user) {
          isSignFavorited(sign.name)
            .then(favorited => {
              setIsFavorite(favorited);
            })
            .catch(error => {
              console.error("Error checking if sign is favorited:", error);
            });
        }
      } catch (error) {
        console.error("Error fetching zodiac data:", error);
        toast({
          title: "Error",
          description: "Failed to load your personalized horoscope",
          variant: "destructive"
        });
      }
    };
    
    if (!externalLoading) {
      fetchData();
    } else {
      // If external loading is in progress, we should still check for favorites
      if (user) {
        isSignFavorited(sign.name)
          .then(favorited => {
            setIsFavorite(favorited);
          })
          .catch(error => {
            console.error("Error checking if sign is favorited:", error);
          });
      }
    }
    
    // Reset scroll position when sign changes
    if (scrollRef.current && !isInitialMount.current) {
      scrollRef.current.scrollTop = 0;
    }
    
    isInitialMount.current = false;
    
    return () => {
      // Clean up any pending operations if needed
    };
  }, [sign, user, toast, externalLoading]);
  
  // Update loading state when loadState changes
  useEffect(() => {
    if (loadState.horoscope && loadState.energy) {
      setIsLoading(false);
    }
  }, [loadState]);
  
  return (
    <div
      className={`card-glass flex flex-col h-full ${isActive ? 'z-10 card-appear' : 'z-0'}`}
      style={style}
    >
      {/* Swipe indicators */}
      <div className={`swipe-indicator left ${isActive ? 'swipe-active' : ''}`}>
        <ArrowLeft size={36} className="text-blue-400" />
      </div>
      <div className={`swipe-indicator right ${isActive ? 'swipe-active' : ''}`}>
        <ArrowRight size={36} className="text-blue-400" />
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
              {isLoading || externalLoading ? (
                <div className="space-y-2">
                  <div className="animate-pulse h-4 bg-white/5 rounded-md w-full"></div>
                  <div className="animate-pulse h-4 bg-white/5 rounded-md w-5/6"></div>
                  <div className="animate-pulse h-4 bg-white/5 rounded-md w-11/12"></div>
                  <div className="animate-pulse h-4 bg-white/5 rounded-md w-4/5"></div>
                </div>
              ) : (
                <p className="text-white/80">{dailyHoroscope}</p>
              )}
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg text-white/90 font-medium mb-2">Social Energy</h3>
              <div className="flex items-center gap-3 mb-2">
                <Battery size={20} className="text-zodiac-stardust-gold" />
                <span className="text-sm text-white/80">
                  {isLoading || externalLoading ? "Loading..." : `${socialEnergyLevel}% Social Energy`}
                </span>
              </div>
              
              {isLoading || externalLoading ? (
                <div className="animate-pulse h-2 bg-white/5 rounded-md"></div>
              ) : (
                <Progress value={socialEnergyLevel} className="h-2 bg-white/10" />
              )}
              
              <p className="mt-2 text-sm text-white/70">
                {isLoading || externalLoading ? (
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
            aria-label="Previous sign"
          >
            <ArrowLeft size={20} />
          </button>
          
          <button 
            onClick={onSwipeRight}
            className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Next sign"
          >
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ZodiacCard;
