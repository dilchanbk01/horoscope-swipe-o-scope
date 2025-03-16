
import React, { useEffect, useState } from 'react';
import ZodiacCard from '@/components/ZodiacCard';
import SwipeControls from '@/components/SwipeControls';
import { useSwipe } from '@/hooks/useSwipe';
import { zodiacSigns } from '@/utils/zodiacData';
import { ArrowLeft, ArrowRight, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Index = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [likedSigns, setLikedSigns] = useState<string[]>([]);
  const [starElements, setStarElements] = useState<React.ReactNode[]>([]);

  // Create stars for the background
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

  const handleSwipeLeft = (index: number) => {
    console.log('Swiped left (dislike):', zodiacSigns[index].name);
  };

  const handleSwipeRight = (index: number) => {
    const signName = zodiacSigns[index].name;
    console.log('Swiped right (like):', signName);
    
    if (!likedSigns.includes(signName)) {
      setLikedSigns([...likedSigns, signName]);
      toast({
        title: `Added ${signName} to your favorites!`,
        description: "Check your profile to see all your favorite signs.",
        icon: <Sparkles className="h-5 w-5 text-zodiac-stardust-gold" />,
      });
    }
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
  });

  const currentSign = zodiacSigns[state.currentIndex];

  // Style for the card during swipe
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
      
      <div 
        ref={containerRef}
        className="swipeable-card-stack w-full max-w-[600px] h-[450px] md:h-[500px]"
        {...handlers}
      >
        <div 
          className={`swipeable-card card-glass ${state.isSwiping ? 'swiping' : ''}`} 
          style={cardStyle}
        >
          <ZodiacCard 
            sign={currentSign} 
            isActive={true}
            onSwipeLeft={goToPrevious}
            onSwipeRight={goToNext}
          />
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
                <ArrowRight size={16} /> Swipe right to like and go to the next sign
              </li>
              <li>
                Click on the navigation links to explore your personal horoscope and check compatibility
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
