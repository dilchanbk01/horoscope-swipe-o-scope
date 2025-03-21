
import React from 'react';
import { Link } from 'react-router-dom';
import { User, Heart } from 'lucide-react';

const MobileQuickNav: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
      <div className="glass px-4 py-3 rounded-full flex items-center space-x-4">
        <Link 
          to="/personal" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-zodiac-mystic-purple/20 text-zodiac-mystic-purple"
          aria-label="Your Personal Horoscope"
        >
          <User size={20} />
        </Link>
        
        <Link 
          to="/compatibility" 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-zodiac-stardust-gold/20 text-zodiac-stardust-gold"
          aria-label="Check Compatibility"
        >
          <Heart size={20} />
        </Link>
      </div>
    </div>
  );
};

export default MobileQuickNav;
