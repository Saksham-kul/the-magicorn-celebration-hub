import { motion } from "framer-motion";
import { Gift, Landmark, Users, CalendarDays, Megaphone } from "lucide-react";

const services = [
  {
    icon: Gift,
    title: "Premium Corporate Gifting Solutions",
    description: "Curated gifts that reflect your brand's class and intent.",
  },
  {
    icon: Landmark,
    title: "Trusted Partner for Government & Institutional Supplies",
    description:
      "Reliable, compliant, and tailored for large-scale requirements.",
  },
  {
    icon: Users,
    title: "Employee & Client Engagement Gifting",
    description:
      "Strengthen relationships with thoughtful, memorable gifting experiences.",
  },
  {
    icon: CalendarDays,
    title: "Corporate Events & Conferences",
    description: "Seamless support to elevate every professional gathering.",
  },
  {
    icon: Megaphone,
    title: "Brand Launches & Engagement Campaigns",
    description: "Make powerful first impressions and drive lasting recall.",
  },
];

const WhatWeDo = () => {
  return (
    <section id="services" className="section-dark py-24 lg:py-32 border-t border-gold/10">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-2xl mx-auto mb-20"
        >
          <span className="eyebrow">Our Expertise</span>
          <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground mt-4 mb-6">
            What We Do
          </h2>
          <div className="gold-divider mx-auto" />
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative p-8 border border-gold/15 rounded-sm bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 hover:border-gold/40 hover:shadow-[0_0_30px_-10px_hsl(var(--gold)/0.4)] hover:scale-[1.03]"
              >
                <div className="mb-6 w-14 h-14 rounded-full border border-gold/40 flex items-center justify-center group-hover:border-gold transition-colors">
                  <Icon
                    className="w-6 h-6 text-gold"
                    strokeWidth={1.25}
                  />
                </div>
                <h3 className="font-display text-lg text-primary-foreground mb-3 leading-snug">
                  {service.title}
                </h3>
                <p className="font-body text-sm text-primary-foreground/65 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center font-body text-sm md:text-base text-primary-foreground/60 italic mt-16 tracking-wide"
        >
          From concept to completion, we handle everything with precision.
        </motion.p>
      </div>
    </section>
  );
};

export default WhatWeDo;
