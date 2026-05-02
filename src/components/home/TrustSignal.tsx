import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TrustSignal = () => {
  return (
    <section className="section-dark py-16 border-t border-gold/10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <Quote className="w-8 h-8 text-gold/60 mx-auto mb-6" strokeWidth={1.25} />
          <p className="font-display italic text-xl md:text-2xl text-primary-foreground/85 leading-relaxed">
            "The Magicorn delivered with precision, elegance, and an unmatched
            sense of detail — a true partner in every sense."
          </p>
          <div className="mt-6 flex items-center justify-center gap-4 text-xs tracking-[0.3em] uppercase text-primary-foreground/50">
            <span className="w-8 h-px bg-gold/40" />
            Trusted by leading brands & institutions
            <span className="w-8 h-px bg-gold/40" />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSignal;
