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
      <p className="pointer-events-none absolute left-1/2 top-[78.5%] w-full -translate-x-1/2 -translate-y-1/2 px-4 text-center font-display text-sm font-semibold tracking-[0.12em] text-purple-deep sm:text-xl md:text-2xl md:tracking-[0.18em]">
        Crafting Experiences, Creating Memories
      </p>
    </section>
  );
};

export default Hero;
