import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import ZodiacCard from '@/components/ZodiacCard';
import SwipeControls from '@/components/SwipeControls';
import { useSwipe } from '@/hooks/useSwipe';
import { zodiacSigns } from '@/utils/zodiacData';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [starElements, setStarElements] = useState<React.ReactNode[]>([]);
  const [user, setUser] = useState<any | null>(null);
  const [cardKey, setCardKey] = useState(0);

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
  }, []);

  const handleCardChange = () => {
    setCardKey(prev => prev + 1);
  };

  const handleSwipeLeft = (index: number) => {
    console.log('Swiped left (dislike):', zodiacSigns[index].name);
  };

  const handleSwipeRight = (index: number) => {
    const signName = zodiacSigns[index].name;
    console.log('Swiped right (explore):', signName);
  };

  const {
    handlers,
    state,
    goToNext,
    goToPrevious,
    containerRef,
  } = useSwipe({
    onSwipeLeft: handleSwipeLeft,
    onSwipeRight: handleSwipeRight,
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
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
      <div className="stars-container">
        {starElements}
      </div>
      
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
          Discover Your Stars
        </h1>
        <p className="text-lg text-white/70 max-w-md mx-auto">
          Swipe through zodiac signs to find your cosmic match
        </p>
      </div>
      
      <div className="w-full max-w-[600px] h-[450px] md:h-[500px]">
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
              key={`zodiac-card-${cardKey}-${currentSign.name}`}
            />
          </div>
        </div>
      </div>
      
      <SwipeControls
        onPrevious={goToPrevious}
        onNext={goToNext}
        currentIndex={state.currentIndex}
        total={zodiacSigns.length}
      />
      
      <div className="mt-8 flex flex-col items-center">
        <button
          onClick={() => setShowInfo(!showInfo)}
          className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
        >
          {showInfo ? (
            <>
              <span>Hide instructions</span>
              <ChevronUp size={20} />
            </>
          ) : (
            <>
              <span>How to use</span>
              <ChevronDown size={20} />
            </>
          )}
        </button>
        
        {showInfo && (
          <div className="mt-4 max-w-md glass p-4 rounded-lg animate-fade-in">
            <h3 className="font-medium mb-2">How to use this app:</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li className="flex items-center gap-2">
                <ArrowLeft size={16} /> Swipe left to skip to the previous sign
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight size={16} /> Swipe right to explore and go to the next sign
              </li>
              <li>
                Click on the navigation links to explore your personal horoscope and check compatibility
              </li>
              {!user && (
                <li className="mt-4 pt-2 border-t border-white/10">
                  <Link to="/auth" className="text-zodiac-stardust-gold hover:underline">
                    Sign in or create an account
                  </Link> to access additional features
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
