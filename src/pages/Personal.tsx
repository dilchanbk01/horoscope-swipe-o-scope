
import React from 'react';
import PersonalHoroscope from '@/components/PersonalHoroscope';
import { ScrollArea } from '@/components/ui/scroll-area';

const PersonalPage = () => {
  return (
    <ScrollArea className="h-[calc(100vh-6rem)]">
      <div className="flex flex-col items-center justify-center min-h-fit py-8">
        <div className="text-center mb-6 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold">
            Your Personal Horoscope
          </h1>
        </div>
        
        <PersonalHoroscope />
      </div>
    </ScrollArea>
  );
};

export default PersonalPage;
