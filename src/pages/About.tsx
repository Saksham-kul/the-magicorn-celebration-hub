import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Sparkles, Heart, Star, Award, Users, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const values = [
  {
    icon: Heart,
    title: "Passion",
    description:
      "Every celebration we touch is infused with our genuine love for creating magical moments.",
  },
  {
    icon: Star,
    title: "Excellence",
    description:
      "We never settle for ordinary. Every detail is crafted to exceed expectations.",
  },
  {
    icon: Award,
    title: "Quality",
    description:
      "From materials to execution, we maintain the highest standards in everything we do.",
  },
  {
    icon: Users,
    title: "Personal Touch",
    description:
      "We believe every celebration is unique, and we treat each client like family.",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-purple-deep relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-1/4 w-64 h-64 bg-gold rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-purple-light rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-gold mb-4">
                Our Story
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                The Magic Behind
                <br />
                <span className="text-gradient-gold">The Magicorn</span>
              </h1>
              <p className="font-body text-lg text-primary-foreground/80">
                Where every celebration becomes a magical journey of joy,
                elegance, and unforgettable memories.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-flex items-center gap-2 text-gold font-body text-sm tracking-wider uppercase mb-4">
                  <Sparkles className="w-4 h-4" />
                  Our Journey
                </span>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Crafting Magic Since Day One
                </h2>
                <div className="space-y-4 font-body text-muted-foreground leading-relaxed">
                  <p>
                    The Magicorn was born from a simple belief: every celebration
                    deserves to be magical. What started as a passion project has
                    grown into a full-service event planning and gifting company
                    that has touched thousands of lives.
                  </p>
                  <p>
                    We understand that celebrations are not just events—they're
                    milestones, memories in the making, and expressions of love.
                    That's why we pour our hearts into every hamper we create,
                    every party we plan, and every gift we curate.
                  </p>
                  <p>
                    From intimate family gatherings to grand corporate events, we
                    bring the same level of dedication, creativity, and attention
                    to detail. Because at The Magicorn, we don't just plan
                    events—we create experiences that last a lifetime.
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute -top-4 -left-4 w-full h-full bg-gold/20 rounded-2xl" />
                <div className="relative bg-gradient-to-br from-purple-deep to-purple-royal rounded-2xl p-12 text-center">
                  <Target className="w-16 h-16 text-gold mx-auto mb-6" />
                  <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-4">
                    Our Mission
                  </h3>
                  <p className="font-body text-primary-foreground/80 leading-relaxed">
                    To transform every celebration into a magical experience,
                    creating moments of joy that become cherished memories for a
                    lifetime.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-24 bg-cream">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-gold mb-4">
                What Drives Us
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Our Core Values
              </h2>
              <div className="decorative-line w-24 mx-auto" />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-2xl bg-purple-deep flex items-center justify-center mx-auto mb-6">
                    <value.icon className="w-8 h-8 text-gold" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="font-body text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-purple-deep">
          <div className="container mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Ready to Create Magic Together?
              </h2>
              <p className="font-body text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                Let's turn your celebration dreams into reality. Reach out to us
                and let the magic begin!
              </p>
              <Button
                asChild
                size="lg"
                className="btn-magical rounded-full px-10 py-6 font-body"
              >
                <Link to="/contact">Get In Touch</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
