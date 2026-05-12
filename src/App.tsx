import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Gallery from "./pages/Gallery";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Catalogue from "./pages/Catalogue";
import MediaStudio from "./pages/MediaStudio";
import NotFound from "./pages/NotFound";
import { STUDIO_ROUTE } from "./lib/studioAuth";
import { fetchCloudinaryAssets } from "./lib/cloudinary";
import { useMediaStore } from "./lib/mediaStore";

const queryClient = new QueryClient();

const ProductionRouteBridge = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const route = params.get("studioRoute");

    if (route === STUDIO_ROUTE) {
      navigate(STUDIO_ROUTE, { replace: true });
    }
  }, [navigate]);

  return null;
};

const AssetInitializer = () => {
  const { isInitialized, setAssets, setInitialized } = useMediaStore();

  useEffect(() => {
    if (isInitialized) return;

    const initializeAssets = async () => {
      try {
        const assets = await fetchCloudinaryAssets();
        if (assets.length > 0) {
          setAssets(assets);
        }
      } catch (error) {
        console.error("Failed to initialize assets:", error);
      } finally {
        setInitialized(true);
      }
    };

    initializeAssets();
  }, [isInitialized, setAssets, setInitialized]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AssetInitializer />
        <ProductionRouteBridge />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/about" element={<About />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/studio/media-control-x9" element={<MediaStudio />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
