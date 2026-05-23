import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaStore } from "@/lib/mediaStore";


const fallbackPreviews = [
  
];

const Catalogue = () => {
  const media = useMediaStore((s) => s.media);

  // Use media items if available, otherwise fall back to local assets
  const previews =
    media && media.length >= 3
      ? media.slice(0, 3).map((item) => ({
          src: item.cloudinary_url,
          label: item.name,
        }))
      : fallbackPreviews;

  return (
    <section
      id="catalogue"
      className="section-dark py-24 lg:py-32 border-t border-gold/10"
    >
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="eyebrow">Explore</span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground mt-4 mb-6">
            Our Catalogue
          </h2>
          <div className="gold-divider mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {previews.map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-gold/15"
            >
              <img
                src={p.src}
                alt={p.label}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/90 via-purple-deep/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="w-8 h-px bg-gold mb-3" />
                <h3 className="font-display text-xl text-primary-foreground">
                  {p.label}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="btn-magical rounded-none px-10 py-6 font-body text-xs tracking-[0.25em]"
          >
            <Link to="/catalogue">VIEW CATALOGUE <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Catalogue;
