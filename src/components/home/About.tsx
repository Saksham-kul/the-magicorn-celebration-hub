import { motion } from "framer-motion";
import gallery1 from "@/assets/gallery-1.jpg";

const About = () => {
  return (
    <section id="about" className="section-dark py-24 lg:py-32">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7 }}
          >
            <span className="eyebrow">Who We Are</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground mt-4 mb-6 leading-[1.15]">
              About Us
            </h2>
            <div className="gold-divider mb-8" />
            <div className="space-y-5 font-body text-base md:text-lg text-primary-foreground/75 leading-relaxed max-w-xl">
              <p>
                The Magicorn Collectives is a premium corporate gifting and
                event management company, dedicated to creating impactful
                experiences that strengthen relationships and elevate brand
                value.
              </p>
              <p>
                We specialize in curated corporate gifting solutions and
                seamless event execution, combining creativity, precision, and
                attention to detail. Whether it's thoughtfully designed gift
                hampers or professionally managed corporate events, every
                offering is crafted to reflect elegance and purpose.
              </p>
              <p>
                With a focus on quality, customization, and timely delivery, we
                partner with organizations to deliver solutions that are not
                just functional but memorable.
              </p>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-2 border border-gold/30 rounded-sm pointer-events-none" />
            <img
              src={gallery1}
              alt="Premium corporate gift presentation"
              className="relative w-full h-[480px] object-cover rounded-sm"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
