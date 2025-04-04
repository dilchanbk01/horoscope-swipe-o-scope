
import React, { useEffect, useState, useRef } from 'react';
import ZodiacCard from '@/components/ZodiacCard';
import { useSwipe } from '@/hooks/useSwipe';
import { zodiacSigns } from '@/utils/zodiacData';
import { supabase } from '@/integrations/supabase/client';
import { prefetchHoroscopeData } from '@/services/horoscopeApi';

const Index = () => {
  const [starElements, setStarElements] = useState<React.ReactNode[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [cardKey, setCardKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    
    getUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const generateStars = () => {
      const stars = [];
      for (let i = 0; i < 100; i++) {
        const size = Math.random() * 3 + 1;
        stars.push(
          <div
            key={i}
            className="star"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        );
      }
      setStarElements(stars);
    };

    generateStars();
    
    const prefetchData = async () => {
      setIsLoading(true);
      try {
        const signNames = zodiacSigns.map(sign => sign.name);
        await prefetchHoroscopeData(signNames);
      } catch (err) {
        console.error("Error prefetching horoscope data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    prefetchData();
  }, []);

  const handleCardChange = () => {
    setCardKey(prev => prev + 1);
  };

  const {
    handlers,
    state,
    goToNext,
    goToPrevious,
    containerRef,
  } = useSwipe({
    onSwipeLeft: () => {},
    onSwipeRight: () => {},
    itemsLength: zodiacSigns.length,
    onCardChange: handleCardChange
  });

  const currentSign = zodiacSigns[state.currentIndex];

  const cardStyle = state.isSwiping
    ? {
        transform: `translateX(${state.offset}px) rotate(${state.offset * 0.05}deg)`,
      }
    : undefined;

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center px-4 overflow-hidden">
      <div className="stars-container absolute inset-0 pointer-events-none">
        {starElements}
      </div>
      
      <div className="w-full max-w-[600px] h-[450px] md:h-[500px] relative">
        <div 
          ref={containerRef}
          className="swipeable-card-stack w-full max-w-[600px] h-[450px] md:h-[500px]"
          {...handlers}
        >
          <div 
            className={`swipeable-card ${state.isSwiping ? 'swiping' : ''}`} 
            style={cardStyle}
          >
            <ZodiacCard 
              sign={currentSign} 
              isActive={true}
              onSwipeLeft={goToPrevious}
              onSwipeRight={goToNext}
              isLoading={isLoading}
              key={`zodiac-card-${cardKey}-${currentSign.name}`}
            />
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 mt-6 pb-10">
        {Array.from({ length: zodiacSigns.length }).map((_, index) => (
          <div
            key={index}
            className={`transition-all duration-300 ${
              index === state.currentIndex ? 'bg-white w-4 h-2 rounded-full' : 'bg-white/30 w-2 h-2 rounded-full'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Index;
