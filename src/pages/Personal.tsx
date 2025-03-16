
import React from 'react';
import PersonalHoroscope from '@/components/PersonalHoroscope';

const PersonalPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)]">
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">
          Your Personal Horoscope
        </h1>
        <p className="text-lg text-white/70 max-w-md mx-auto">
          Discover what the stars have in store for you
        </p>
      </div>
      
      <PersonalHoroscope />
    </div>
  );
};

export default PersonalPage;
