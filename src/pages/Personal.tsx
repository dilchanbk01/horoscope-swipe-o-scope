
import React, { useEffect } from 'react';
import PersonalHoroscope from '@/components/PersonalHoroscope';
import { Helmet } from 'react-helmet';

const PersonalPage = () => {
  // This ensures the page scrolls to top when navigated to directly
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Your Personal Horoscope | Zodible</title>
        <meta name="description" content="Get your personalized horoscope reading based on your birth date and zodiac sign." />
        <link rel="canonical" href="https://zodible.site/personal" />
        <meta property="og:title" content="Your Personal Horoscope | Zodible" />
        <meta property="og:description" content="Get your personalized horoscope reading based on your birth date and zodiac sign." />
        <meta property="og:url" content="https://zodible.site/personal" />
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
