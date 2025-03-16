
import { useState, useRef, useEffect, MouseEvent, TouchEvent } from 'react';

interface SwipeState {
  isSwiping: boolean;
  direction: 'left' | 'right' | null;
  offset: number;
  initialX: number;
  currentIndex: number;
}

interface UseSwipeProps {
  onSwipeLeft?: (index: number) => void;
  onSwipeRight?: (index: number) => void;
  threshold?: number;
  itemsLength: number;
  initialIndex?: number;
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 100,
  itemsLength,
  initialIndex = 0
}: UseSwipeProps) {
  const [state, setState] = useState<SwipeState>({
    isSwiping: false,
    direction: null,
    offset: 0,
    initialX: 0,
    currentIndex: initialIndex
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  const handleStart = (clientX: number) => {
    setState(prev => ({
      ...prev,
      isSwiping: true,
      initialX: clientX,
      direction: null
    }));
  };

  const handleMove = (clientX: number) => {
    if (!state.isSwiping) return;

    const offset = clientX - state.initialX;
    const direction = offset > 0 ? 'right' : 'left';
    
    setState(prev => ({
      ...prev,
      offset,
      direction
    }));
  };

  const handleEnd = () => {
    if (!state.isSwiping) return;

    const isSwipeLeft = state.direction === 'left' && state.offset < -threshold;
    const isSwipeRight = state.direction === 'right' && state.offset > threshold;

    if (isSwipeLeft) {
      onSwipeLeft?.(state.currentIndex);
      goToNext();
    } else if (isSwipeRight) {
      onSwipeRight?.(state.currentIndex);
      goToPrevious();
    }

    setState(prev => ({
      ...prev,
      isSwiping: false,
      offset: 0,
      direction: null
    }));
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    handleEnd();
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    handleEnd();
  };

  const goToNext = () => {
    setState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % itemsLength,
      isSwiping: false,
      offset: 0,
      direction: null
    }));
  };

  const goToPrevious = () => {
    setState(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + itemsLength) % itemsLength,
      isSwiping: false,
      offset: 0,
      direction: null
    }));
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Events for mouse leaving the window
  useEffect(() => {
    const handleMouseLeave = () => {
      if (state.isSwiping) {
        handleEnd();
      }
    };

    window.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [state.isSwiping]);

  return {
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: handleMouseMove,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    state: {
      isSwiping: state.isSwiping,
      direction: state.direction,
      offset: state.offset,
      currentIndex: state.currentIndex,
    },
    goToNext,
    goToPrevious,
    containerRef,
  };
}
