import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import Gallery from "@/components/home/Gallery";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Services />
        <Gallery />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
