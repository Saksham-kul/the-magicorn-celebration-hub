import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import WhatWeDo from "@/components/home/WhatWeDo";
import Featured from "@/components/home/Featured";
import Stats from "@/components/home/Stats";
import Catalogue from "@/components/home/Catalogue";
import TrustSignal from "@/components/home/TrustSignal";
import ContactSection from "@/components/home/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-purple-deep">
      <Header />
      <main>
        <Hero />
        <About />
        <WhatWeDo />
        <Featured />
        <Stats />
        <Catalogue />
        <TrustSignal />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
