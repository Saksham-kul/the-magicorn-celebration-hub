import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.png";

const Hero = () => {
  return (
    <section
      id="top"
      className="relative w-full bg-purple-deep overflow-hidden"
    >
      <motion.img
        src={heroBg}
        alt="The Magicorn Collectives — premium corporate gifting"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="block w-full h-auto select-none"
        draggable={false}
      />
      {/* Optional ≤10% subtle dark overlay */}
      <div className="absolute inset-0 bg-purple-deep/10 pointer-events-none" />
    </section>
  );
};

export default Hero;
