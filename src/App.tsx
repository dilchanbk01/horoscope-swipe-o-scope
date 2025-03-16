
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Index from "./pages/Index";
import PersonalPage from "./pages/Personal";
import CompatibilityPage from "./pages/Compatibility";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
