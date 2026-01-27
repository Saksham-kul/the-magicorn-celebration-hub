import { motion } from "framer-motion";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Gift, PartyPopper, Package, Sparkles, Heart, Crown, Star, Cake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const servicesData = [
  {
    icon: Gift,
    title: "Premium Gifting",
    description:
      "Thoughtfully curated gifts that leave lasting impressions. From corporate hampers to personalized treasures, every gift tells a story.",
    features: [
      "Personalized gift selection",
      "Luxury packaging options",
      "Handwritten note cards",
      "Same-day delivery available",
    ],
    color: "from-gold/20 to-gold/5",
  },
  {
    icon: PartyPopper,
    title: "Festive & Party Essentials",
    description:
      "Transform any space into a celebration. Our handpicked decorations, themes, and party supplies bring your vision to life.",
    features: [
      "Theme consultation",
      "Custom decorations",
      "Party supplies",
      "Setup assistance",
    ],
    color: "from-blush/30 to-blush/10",
  },
  {
    icon: Package,
    title: "Custom Hampers & Packaging",
    description:
      "Bespoke hampers designed to delight. We craft custom packaging solutions for weddings, corporate events, and special occasions.",
    features: [
      "Custom box designs",
      "Branded packaging",
      "Bulk orders",
      "Premium materials",
    ],
    color: "from-mint/30 to-mint/10",
  },
  {
    icon: Sparkles,
    title: "Unique Curated Collections",
    description:
      "Discover exclusive collections you won't find anywhere else. Limited edition sets and seasonal specials curated with care.",
    features: [
      "Seasonal specials",
      "Limited editions",
      "Trending collections",
      "Exclusive items",
    ],
    color: "from-lavender/30 to-lavender/10",
  },
  {
    icon: Heart,
    title: "Wedding Trousseau Packing",
    description:
      "Make your special day even more memorable with our exquisite trousseau packing services. Every fold tells a story of love.",
    features: [
      "Bridal trousseau",
      "Groom's collection",
      "Ring ceremony sets",
      "Customized themes",
    ],
    color: "from-blush/30 to-blush/10",
  },
  {
    icon: Crown,
    title: "Corporate Events",
    description:
      "Elevate your corporate celebrations with premium gifting solutions and event essentials that reflect your brand's excellence.",
    features: [
      "Branded merchandise",
      "Employee appreciation",
      "Client gifting",
      "Event decor",
    ],
    color: "from-gold/20 to-gold/5",
  },
  {
    icon: Star,
    title: "Return Gifts",
    description:
      "Send your guests home with a piece of your celebration. Our return gift collections are designed to delight and surprise.",
    features: [
      "Age-appropriate options",
      "Bulk pricing",
      "Custom packaging",
      "Theme matching",
    ],
    color: "from-mint/30 to-mint/10",
  },
  {
    icon: Cake,
    title: "Birthday Specials",
    description:
      "Make every birthday magical with our complete party solutions, from decorations to personalized gifts and party favors.",
    features: [
      "Complete party kits",
      "Theme decoration",
      "Custom cakes arrangements",
      "Party favors",
    ],
    color: "from-lavender/30 to-lavender/10",
  },
];

const ServicesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 bg-purple-deep relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-64 h-64 bg-gold rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-light rounded-full blur-3xl" />
          </div>
          <div className="container mx-auto px-6 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-gold mb-4">
                Our Services
              </span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6">
                Magical Services for
                <br />
                <span className="text-gradient-gold">Every Celebration</span>
              </h1>
              <p className="font-body text-lg text-primary-foreground/80">
                From premium gifting to complete event styling, we bring your
                celebration dreams to life with attention to every magical detail.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {servicesData.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="card-magical rounded-2xl p-8 lg:p-10"
                >
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6`}
                  >
                    <service.icon className="w-8 h-8 text-purple-deep" />
                  </div>
                  <h3 className="font-display text-2xl font-semibold text-foreground mb-4">
                    {service.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-sm font-body text-muted-foreground"
                      >
                        <Sparkles className="w-4 h-4 text-gold" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mt-16"
            >
              <p className="font-body text-lg text-muted-foreground mb-6">
                Can't find what you're looking for? We love custom requests!
              </p>
              <Button
                asChild
                size="lg"
                className="btn-magical rounded-full px-10 py-6 font-body"
              >
                <Link to="/contact">Get a Custom Quote</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ServicesPage;
