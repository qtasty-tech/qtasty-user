import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes"; // Import the routes
import { GoogleOAuthProvider } from '@react-oauth/google';

const queryClient = new QueryClient();

const App = () => (
  <GoogleOAuthProvider clientId="171689544950-t9htlk66dj83reqceljl7nugf962729c.apps.googleusercontent.com">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <div className="flex flex-col min-h-screen">
                <AppRoutes /> 
              </div>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </GoogleOAuthProvider>
);

export default App;
