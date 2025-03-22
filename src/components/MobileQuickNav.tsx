
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Heart, Calendar, BookOpen } from 'lucide-react';

const MobileQuickNav: React.FC = () => {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  const isActive = (path: string) => location.pathname === path;
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down - hide nav
        setVisible(false);
      } else {
        // Scrolling up - show nav
        setVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);
  
  return (
    <div 
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 md:hidden transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-20'
      }`}
    >
      <div className="glass px-6 py-3 rounded-full flex items-center justify-between w-[90vw] max-w-md">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center ${
            isActive("/") 
              ? "text-zodiac-stardust-gold" 
              : "text-white/80 hover:text-white"
          }`}
          aria-label="Today's Horoscope"
        >
          <Calendar size={20} />
          <span className="text-xs mt-1">Daily Horoscope</span>
        </Link>
        
        <Link 
          to="/personal" 
          className={`flex flex-col items-center justify-center ${
            isActive("/personal") 
              ? "text-zodiac-mystic-purple" 
              : "text-white/80 hover:text-white"
          }`}
          aria-label="Your Personal Horoscope"
        >
          <User size={20} />
          <span className="text-xs mt-1">Personal</span>
        </Link>
        
        <Link 
          to="/compatibility" 
          className={`flex flex-col items-center justify-center ${
            isActive("/compatibility") 
              ? "text-zodiac-nebula-pink" 
              : "text-white/80 hover:text-white"
          }`}
          aria-label="Check Compatibility"
        >
          <Heart size={20} />
          <span className="text-xs mt-1">Compatibility</span>
        </Link>
        
        <Link 
          to="/blog" 
          className={`flex flex-col items-center justify-center ${
            isActive("/blog") 
              ? "text-zodiac-stardust-gold" 
              : "text-white/80 hover:text-white"
          }`}
          aria-label="Astrology Blog"
        >
          <BookOpen size={20} />
          <span className="text-xs mt-1">Blog</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileQuickNav;
