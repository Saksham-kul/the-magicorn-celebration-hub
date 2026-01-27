import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Gift, PartyPopper, Package, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Gift,
    title: "Premium Gifting",
    description:
      "Thoughtfully curated gifts that leave lasting impressions. From corporate hampers to personalized treasures, every gift tells a story.",
    color: "from-gold/20 to-gold/5",
  },
  {
    icon: PartyPopper,
    title: "Festive & Party Essentials",
    description:
      "Transform any space into a celebration. Our handpicked decorations, themes, and party supplies bring your vision to life.",
    color: "from-blush/30 to-blush/10",
  },
  {
    icon: Package,
    title: "Custom Hampers & Packaging",
    description:
      "Bespoke hampers designed to delight. We craft custom packaging solutions for weddings, corporate events, and special occasions.",
    color: "from-mint/30 to-mint/10",
  },
  {
    icon: Sparkles,
    title: "Unique Curated Collections",
    description:
      "Discover exclusive collections you won't find anywhere else. Limited edition sets and seasonal specials curated with care.",
    color: "from-lavender/30 to-lavender/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

const Services = () => {
  return (
    <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-purple-light/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-gold mb-4">
            What We Offer
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            Our Magical <span className="text-gradient-purple">Services</span>
          </h2>
          <div className="decorative-line w-24 mx-auto mb-6" />
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            From premium gifts to complete event styling, we bring your celebration
            dreams to life with attention to every magical detail.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="card-magical rounded-2xl p-8 lg:p-10 group cursor-pointer"
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <service.icon className="w-8 h-8 text-purple-deep" />
              </div>
              <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                {service.title}
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed mb-6">
                {service.description}
              </p>
              <span className="inline-flex items-center text-gold font-body font-medium group-hover:gap-3 gap-1 transition-all">
                Learn More <ArrowRight className="w-4 h-4" />
              </span>
            </motion.div>
          ))}
        </motion.div>

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
            <Link to="/services">
              View All Services
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
