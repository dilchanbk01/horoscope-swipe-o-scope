
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const NavBar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<any | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  
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
    
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.scrollY > 80) { // Scrolling down & past header
          setIsNavVisible(false);
        } else { // Scrolling up
          setIsNavVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    
    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);
  
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsMenuOpen(false);
  };
  
  const isActive = (path: string) => location.pathname === path;
  
  const navLinks = [
    { path: '/', label: 'Horoscopes' },
    { path: '/personal', label: 'Your Horoscope' },
    { path: '/compatibility', label: 'Compatibility' },
  ];
  
  return (
    <header 
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 animate-fade-in nav-transition ${
        isNavVisible ? 'nav-visible' : 'nav-scrolled-up'
      }`}
    >
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
            {user ? (
              <li>
                <Button
                  variant="outline"
                  className="gap-2 border-white/20 text-white hover:bg-white/10"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </li>
            ) : (
              <li>
                <Link to="/auth">
                  <Button variant="outline" className="gap-2 border-white/20 text-white hover:bg-white/10">
                    Sign In
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </nav>
        
        {/* Mobile menu button */}
        <div className="flex items-center gap-4 md:hidden">
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
              {user ? (
                <li>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive/90"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </li>
              ) : (
                <li>
                  <Link
                    to="/auth"
                    className="block px-3 py-2 rounded-lg transition-colors text-white/70 hover:bg-white/5 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
