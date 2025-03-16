
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import AuthButton from './AuthButton';
import { supabase } from "@/integrations/supabase/client";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const location = useLocation();
  
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
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: '/', label: 'Horoscopes' },
    { path: '/personal', label: 'Your Horoscope' },
    { path: '/compatibility', label: 'Compatibility' },
  ];
  
  // Add profile and settings links for authenticated users
  const authLinks = user ? [
    { path: '/profile', label: 'Profile' },
  ] : [];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 animate-fade-in">
      <div className="glass px-6 py-4 mx-4 mt-4 rounded-xl flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="text-zodiac-stardust-gold text-2xl animate-pulse-subtle">✧</div>
          <h1 className="font-display text-xl font-medium">HoroscopeSwipe</h1>
        </Link>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <ul className="flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative px-2 py-1 transition-colors ${
                    isActive(link.path)
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-zodiac-stardust-gold rounded-full animate-fade-in" />
                  )}
                </Link>
              </li>
            ))}
            {user && authLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`relative px-2 py-1 transition-colors ${
                    isActive(link.path)
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive(link.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-zodiac-stardust-gold rounded-full animate-fade-in" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          <AuthButton user={user} />
        </nav>
        
        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
          <AuthButton user={user} />
          <button
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="glass md:hidden px-4 py-4 mx-4 mt-2 rounded-xl animate-fade-in">
          <nav>
            <ul className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              {user && authLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`block px-3 py-2 rounded-lg transition-colors ${
                      isActive(link.path)
                        ? 'bg-white/10 text-white'
                        : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
