
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import NavBar from "./components/NavBar";
import MobileQuickNav from "./components/MobileQuickNav";
import Index from "./pages/Index";
import PersonalPage from "./pages/Personal";
import CompatibilityPage from "./pages/Compatibility";
import BlogPage from "./pages/Blog";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./hooks/useAuth";

// Create a new query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Helmet>
          <title>Zodible - Daily Horoscopes & Astrological Insights</title>
          <meta name="description" content="Discover your daily horoscope, personalized astrological insights, and compatibility readings at Zodible." />
          <meta property="og:title" content="Zodible - Your Personal Astrology Guide" />
          <meta property="og:description" content="Get daily horoscopes, personalized astrological readings, and compatibility insights." />
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://zodible.site" />
          <meta property="og:image" content="/og-image.png" />
          <link rel="canonical" href="https://zodible.site" />
        </Helmet>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen">
            <div className="stars-container">
              {/* Stars will be generated using JavaScript */}
            </div>
            <NavBar />
            <div className="pt-24 pb-16 px-4">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/personal" element={<PersonalPage />} />
                <Route path="/compatibility" element={<CompatibilityPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:slug" element={<BlogPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </div>
            <MobileQuickNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
