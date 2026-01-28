import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl">
        <div className="decorative-line" />
      </div>
      <div className="absolute top-10 left-10 animate-float">
        <Sparkles className="w-8 h-8 text-gold/30" />
      </div>
      <div className="absolute bottom-10 right-10 animate-float" style={{ animationDelay: "2s" }}>
        <Sparkles className="w-6 h-6 text-purple-light/30" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center"
        >
          <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-gold mb-6">
            Let's Create Magic Together
          </span>
          
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
            Ready to Make Your
            <br />
            <span className="text-gradient-purple">Celebration Magical?</span>
          </h2>

          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12">
            Whether it's an intimate gathering or a grand celebration, we're here to
            turn your vision into an unforgettable experience. Let's start planning
            your magical moment today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="btn-magical rounded-full px-10 py-6 font-body group"
            >
              <Link to="/contact">
                Get Your Custom Quote
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-10 py-6 font-body border-2 border-purple-deep text-purple-deep hover:bg-purple-deep hover:text-primary-foreground transition-all"
            >
              <a href="tel:+919910105734">
                <Phone className="mr-2 w-4 h-4" />
                Call Us Now
              </a>
            </Button>
          </div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-12 border-t border-border"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: "500+", label: "Events Crafted" },
                { number: "1000+", label: "Happy Clients" },
                { number: "5+", label: "Years Experience" },
                { number: "100%", label: "Satisfaction" },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="font-display text-3xl md:text-4xl font-bold text-gradient-gold mb-2">
                    {stat.number}
                  </div>
                  <div className="font-body text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTA;
