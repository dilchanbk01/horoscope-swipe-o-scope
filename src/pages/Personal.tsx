
import React from 'react';
import PersonalHoroscope from '@/components/PersonalHoroscope';

const PersonalPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-6rem)] py-4 px-2">
      <div className="text-center mb-4 animate-fade-in">
        <h1 className="text-3xl md:text-5xl font-display font-bold">
          Your Personal Horoscope
        </h1>
      </div>
      
      <PersonalHoroscope />
    </div>
  );
};

export default PersonalPage;
