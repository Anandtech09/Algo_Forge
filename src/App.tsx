
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import DataStructures from "./pages/DataStructures";
import Algorithms from "./pages/Algorithms";
import CodePlayground from "./pages/CodePlayground";
import Visualizations from "./pages/Visualizations";
import Demos from "./pages/Demos";
import NotFound from "./pages/NotFound";
import Practice from "./pages/Practice";
import Community from "./pages/Community";
import Auth from "./pages/Auth";

const queryClient = new QueryClient();

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/data-structures" element={<DataStructures />} />
            <Route path="/algorithms" element={<Algorithms />} />
            <Route path="/playground" element={<CodePlayground />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/demos" element={<Demos />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/community" element={<Community />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
