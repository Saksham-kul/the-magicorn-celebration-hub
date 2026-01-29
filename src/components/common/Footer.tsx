import { Link } from "react-router-dom";
import { Sparkles, Instagram, Mail, Phone, MapPin, Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-purple-royal text-primary-foreground">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <Sparkles className="w-8 h-8 text-gold" />
              <span className="font-display text-2xl font-bold">
                THE <span className="text-gold">MAGICORN</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 font-body leading-relaxed mb-6">
              Bringing joy to every celebration. We craft unforgettable moments with
              premium gifting, custom hampers, and curated party essentials.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/the_magicorn"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center hover:bg-gold hover:text-purple-deep transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="mailto:tmagicorn@gmail.com"
                className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center hover:bg-gold hover:text-purple-deep transition-all duration-300"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {["Home", "Services", "Gallery", "About", "Contact"].map((item) => (
                <li key={item}>
                  <Link
                    to={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                    className="text-primary-foreground/70 hover:text-gold transition-colors font-body"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold mb-6">
              Our Services
            </h4>
            <ul className="space-y-3">
              {[
                "Premium Gifting",
                "Party Essentials",
                "Custom Hampers",
                "Wedding Trousseau",
                "Corporate Events",
              ].map((item) => (
                <li key={item}>
                  <Link
                    to="/services"
                    className="text-primary-foreground/70 hover:text-gold transition-colors font-body"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg font-semibold text-gold mb-6">
              Get In Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone size={18} className="text-gold mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/70 font-body">
                  +91 9910105734, +91 9899619619
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="text-gold mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/70 font-body">
                  tmagicorn@gmail.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-gold mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/70 font-body">
                  Noida, Uttar Pradesh, India
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold/20">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm font-body text-center md:text-left">
            © {currentYear} The Magicorn. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm font-body flex items-center gap-1">
            Crafted with <Heart size={14} className="text-gold fill-gold" /> for celebrations
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
