import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AudioProvider } from "@/contexts/AudioContext";
import { CartProvider } from "@/contexts/CartContext";
import { useState } from "react";
import { SplashScreen, shouldShowSplash } from "@/components/SplashScreen";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";
import Settings from "./pages/Settings";
import ProfileEdit from "./pages/ProfileEdit";
import ShipmentTracking from "./pages/ShipmentTracking";
import NotFound from "./pages/NotFound";
import LandingPage from "./pages/LandingPage";
import AboutUs from "./pages/AboutUs";

const queryClient = new QueryClient();

// Splash wrapper — lives inside BrowserRouter so it can navigate
function AppRoutes() {
  const navigate = useNavigate();
  const [splashDone, setSplashDone] = useState(!shouldShowSplash());

  const handleSplashDone = () => {
    setSplashDone(true);
    // Already on "/" which renders Index after splash
  };

  return (
    <>
      {/* Splash — shown once per session, overlays everything */}
      {!splashDone && <SplashScreen onDone={handleSplashDone} />}

      <Routes>
        {/* Product list is now the default home */}
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Index />} />

        {/* Landing page still accessible */}
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/about" element={<AboutUs />} />

        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile/edit" element={<ProfileEdit />} />
        <Route path="/tracking/:orderId" element={<ShipmentTracking />} />

        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <CartProvider>
      <AudioProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </AudioProvider>
    </CartProvider>
  </QueryClientProvider>
);

export default App;
