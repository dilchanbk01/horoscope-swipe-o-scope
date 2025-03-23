
import { useLocation, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet";

const NotFound = () => {
  const location = useLocation();
  const [redirecting, setRedirecting] = useState(false);
  const [countdown, setCountdown] = useState(5);
  
  // Clean the pathname to check if it's a valid route
  const cleanPath = location.pathname.replace(/^\/+|\/+$/g, '');
  
  // List of valid routes in our application
  const validRoutes = ['personal', 'compatibility', 'blog', 'auth', 'profile'];
  const isValidRoute = validRoutes.includes(cleanPath);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access route:",
      location.pathname
    );
    
    // If it's a valid route, start countdown for redirect
    if (isValidRoute) {
      setRedirecting(true);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [location.pathname, isValidRoute, cleanPath]);

  // If it's a valid route and countdown finished, redirect to home first
  if (redirecting && countdown <= 0) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Helmet>
        <title>Page Not Found | Zodible</title>
        <meta name="description" content="The page you're looking for doesn't exist." />
      </Helmet>
      <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
        <div className="card-glass p-10 text-center max-w-md animate-fade-in">
          <div className="text-8xl font-display mb-4 text-white/30">404</div>
          <h1 className="text-3xl font-display font-bold mb-4">Cosmic Void</h1>
          
          {isValidRoute ? (
            <>
              <p className="text-white/70 mb-8">
                The stars are aligning to take you to your destination.
                Redirecting in {countdown} seconds...
              </p>
              <div className="w-full bg-white/10 h-2 rounded-full mb-8">
                <div 
                  className="bg-zodiac-mystic-purple h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(countdown / 5) * 100}%` }}
                />
              </div>
            </>
          ) : (
            <p className="text-white/70 mb-8">
              The stars couldn't find the page you're looking for. It seems to have
              drifted into another dimension.
            </p>
          )}
          
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-zodiac-mystic-purple hover:bg-zodiac-mystic-purple/80 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Return to the Stars</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
