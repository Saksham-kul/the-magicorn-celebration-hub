import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { X, ZoomIn } from "lucide-react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import services1 from "@/assets/services1.jpg";
import services2 from "@/assets/services2.jpeg";
import services3 from "@/assets/services3.jpeg";
import services4 from "@/assets/services4.jpeg";
import services5 from "@/assets/services5.jpeg";

const categories = ["All", "Gifting", "Weddings", "Birthdays", "Corporate"];

const galleryItems = [
  { image: gallery1, title: "Luxury Gift Hamper", category: "Gifting" },
  { image: gallery2, title: "Birthday Celebration", category: "Birthdays" },
  { image: gallery3, title: "Wedding Trousseau", category: "Weddings" },
  { image: gallery4, title: "Corporate Gifts", category: "Corporate" },
  { image: services1, title: "Custom Party Essentials", category: "Gifting" },
  { image: services2, title: "Gift Hampers", category: "Weddings" },
  { image: services3, title: "Birthday Party Setup", category: "Birthdays" },
  { image: services4, title: "School Event Planning", category: "Corporate" },
  { image: services5, title: "Wedding Decor", category: "Weddings" },
];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const filteredItems =
    selectedCategory === "All"
      ? galleryItems
      : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-purple-deep relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 right-20 w-64 h-64 bg-gold rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-gold mb-4">
                Our Portfolio
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Magical <span className="text-gradient-gold">Moments</span>
              </h1>
              <p className="font-body text-lg text-primary-foreground/80">
                A glimpse into the celebrations we've crafted. Each event tells a
                unique story of joy and elegance.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter */}
        <section className="py-12 border-b border-border">
          <div className="container mx-auto px-6">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-full font-body text-sm transition-all duration-300 ${
                    selectedCategory === category
                      ? "bg-purple-deep text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-purple-deep/10"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={`${item.title}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setSelectedImage(item.image)}
                    className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex flex-col items-center justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-gold text-xs tracking-wider uppercase mb-1">
                        {item.category}
                      </span>
                      <h3 className="font-display text-lg text-primary-foreground text-center">
                        {item.title}
                      </h3>
                      <ZoomIn className="w-6 h-6 text-gold mt-3" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedImage(null)}
              className="fixed inset-0 bg-purple-deep/95 z-50 flex items-center justify-center p-6"
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center text-gold hover:bg-gold hover:text-purple-deep transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={selectedImage}
                alt="Gallery"
                className="max-w-full max-h-[85vh] rounded-xl shadow-elevated"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

export default GalleryPage;
