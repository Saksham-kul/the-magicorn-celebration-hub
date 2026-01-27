import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const galleryItems = [
  {
    image: gallery1,
    title: "Premium Gift Hampers",
    category: "Gifting",
  },
  {
    image: gallery2,
    title: "Birthday Celebrations",
    category: "Party Decor",
  },
  {
    image: gallery3,
    title: "Wedding Trousseau",
    category: "Weddings",
  },
  {
    image: gallery4,
    title: "Corporate Events",
    category: "Corporate",
  },
];

const Gallery = () => {
  return (
    <section className="py-24 lg:py-32 bg-cream relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-gold mb-4">
            Our Portfolio
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Magical <span className="text-gradient-purple">Moments</span>
          </h2>
          <div className="decorative-line w-24 mx-auto mb-6" />
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            A glimpse into the celebrations we've crafted. Each event tells a unique
            story of joy, elegance, and unforgettable memories.
          </p>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {galleryItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl aspect-square cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/90 via-purple-deep/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <span className="text-gold font-body text-sm tracking-wider uppercase mb-2">
                  {item.category}
                </span>
                <h3 className="font-display text-2xl lg:text-3xl font-semibold text-primary-foreground text-center px-6 mb-4">
                  {item.title}
                </h3>
                <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center border border-gold/50">
                  <ZoomIn className="w-5 h-5 text-gold" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button
            asChild
            size="lg"
            className="btn-magical rounded-full px-10 py-6 font-body"
          >
            <Link to="/gallery">
              View Full Gallery
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Gallery;
