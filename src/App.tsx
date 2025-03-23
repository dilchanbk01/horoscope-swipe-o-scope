
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { lazy, Suspense } from "react";
import NavBar from "./components/NavBar";
import MobileQuickNav from "./components/MobileQuickNav";
import { AuthProvider } from "./hooks/useAuth";

// Lazy load pages for better performance
const Index = lazy(() => import("./pages/Index"));
const PersonalPage = lazy(() => import("./pages/Personal"));
const CompatibilityPage = lazy(() => import("./pages/Compatibility"));
const BlogPage = lazy(() => import("./pages/Blog"));
const Auth = lazy(() => import("./pages/Auth"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center">
    <div className="card-glass p-8 text-center animate-pulse">
      <p className="text-white/70">Loading cosmic data...</p>
    </div>
  </div>
);

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
          
          {/* PWA meta tags */}
          <meta name="theme-color" content="#0f172a" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Zodible" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          <link rel="manifest" href="/manifest.json" />
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
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/personal" element={<PersonalPage />} />
                  <Route path="/compatibility" element={<CompatibilityPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/blog/:slug" element={<BlogPage />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </div>
            <MobileQuickNav />
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
