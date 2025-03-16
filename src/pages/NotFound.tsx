
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
      <div className="card-glass p-10 text-center max-w-md animate-fade-in">
        <div className="text-8xl font-display mb-4 text-white/30">404</div>
        <h1 className="text-3xl font-display font-bold mb-4">Cosmic Void</h1>
        <p className="text-white/70 mb-8">
          The stars couldn't find the page you're looking for. It seems to have
          drifted into another dimension.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-zodiac-mystic-purple hover:bg-zodiac-mystic-purple/80 text-white px-6 py-3 rounded-lg transition-colors"
        >
          <ArrowLeft size={18} />
          <span>Return to the Stars</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
