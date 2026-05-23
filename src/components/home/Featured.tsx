import { motion } from "framer-motion";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const images = [
  { src: gallery1, alt: "Curated luxury corporate hamper" },
  { src: gallery3, alt: "Bespoke trousseau presentation" },
  { src: gallery4, alt: "Executive gifting set" },
];

const Featured = () => {
  return (
    <section className="section-dark py-24 lg:py-32 border-t border-gold/10">
      <div className="container mx-auto px-6 mb-12 lg:mb-16">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <span className="eyebrow">Featured</span>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-primary-foreground mt-4 leading-tight max-w-2xl">
              Premium Corporate Gifting Solutions
            </h2>
          </div>
          <div className="gold-divider" />
        </div>
      </div>

      {/* Horizontal scroll gallery */}
      <div className="relative">
        <div className="flex gap-6 overflow-x-auto pb-6 px-6 lg:px-12 snap-x snap-mandatory scrollbar-hide">
          {images.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="relative flex-shrink-0 w-[80vw] sm:w-[55vw] lg:w-[34vw] xl:w-[28vw] aspect-[4/5] snap-start group overflow-hidden rounded-sm"
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/0 group-hover:ring-gold/40 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Featured;
