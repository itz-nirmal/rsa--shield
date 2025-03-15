import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom"; // Changed to HashRouter
import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

// Pages
import Home from "./pages/Home";
import KeyGeneration from "./pages/KeyGeneration";
import Encryption from "./pages/Encryption";
import Decryption from "./pages/Decryption";
import Auth from "./pages/Auth";
import Account from "./pages/Account";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <DataProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            {" "}
            {/* Changed to HashRouter */}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/key-generation" element={<KeyGeneration />} />
              <Route path="/encryption" element={<Encryption />} />
              <Route path="/decryption" element={<Decryption />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/account" element={<Account />} />
              <Route path="/team" element={<Team />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>{" "}
          {/* Changed to HashRouter */}
        </DataProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
