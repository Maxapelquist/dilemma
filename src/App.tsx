import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalHeader from "@/components/GlobalHeader";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import PartnerLink from "./pages/PartnerLink";
import Dashboard from "./pages/Dashboard";
import Session from "./pages/Session";
import Preferences from "./pages/Preferences";
import Results from "./pages/Results";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter basename={import.meta.env.PROD ? "/dilemma" : ""}>
        <GlobalHeader />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/partner-link" element={<PartnerLink />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/session/:sessionId" element={<Session />} />
          <Route path="/preferences/:sessionId" element={<Preferences />} />
          <Route path="/results/:sessionId" element={<Results />} />
          <Route path="/admin" element={<Admin />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
