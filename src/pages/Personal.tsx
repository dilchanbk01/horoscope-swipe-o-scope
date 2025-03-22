
import React from 'react';
import PersonalHoroscope from '@/components/PersonalHoroscope';
import { Helmet } from 'react-helmet';

const PersonalPage = () => {
  return (
    <>
      <Helmet>
        <title>Your Personal Horoscope | Zodible</title>
        <meta name="description" content="Get your personalized horoscope reading based on your birth date and zodiac sign." />
        <link rel="canonical" href="/personal" />
      </Helmet>
      <div className="flex flex-col items-center justify-start min-h-[calc(100vh-6rem)] py-4 px-2">
        <div className="text-center mb-4 animate-fade-in">
          <h1 className="text-2xl md:text-4xl font-display font-bold">
            Your Personal Horoscope
          </h1>
        </div>
        
        <div className="w-full max-w-3xl">
          <PersonalHoroscope />
        </div>
      </div>
    </>
  );
};

export default PersonalPage;
