
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import MobileQuickNav from "./components/MobileQuickNav";
import Index from "./pages/Index";
import PersonalPage from "./pages/Personal";
import CompatibilityPage from "./pages/Compatibility";
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
                <Route path="/auth" element={<Auth />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="*" element={<NotFound />} />
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
