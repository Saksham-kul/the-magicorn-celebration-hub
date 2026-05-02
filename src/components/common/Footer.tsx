import { Link } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-purple-deep text-primary-foreground border-t border-gold/15">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png"
                alt="The Magicorn Collectives"
                className="w-9 h-9 object-contain"
              />
              <span className="font-display text-base font-semibold tracking-[0.2em]">
                THE <span className="text-gold">MAGICORN</span>
              </span>
            </Link>
            <p className="text-primary-foreground/60 font-body text-sm leading-relaxed mb-6 max-w-xs">
              Premium corporate gifting and event management — crafted with
              precision, delivered with care.
            </p>
            <a
              href="https://instagram.com/the_magicorn"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-10 h-10 rounded-full border border-gold/40 items-center justify-center text-gold hover:border-gold transition-all duration-300"
              aria-label="Instagram"
            >
              <Instagram size={16} strokeWidth={1.5} />
            </a>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/#about" },
                { label: "Services", href: "/#services" },
                { label: "Catalogue", href: "/#catalogue" },
                { label: "Contact", href: "/#contact" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-primary-foreground/65 hover:text-gold transition-colors font-body text-sm"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-6">
              What We Do
            </h4>
            <ul className="space-y-3 font-body text-sm text-primary-foreground/65">
              <li>Corporate Gifting</li>
              <li>Government & Institutional</li>
              <li>Employee Engagement</li>
              <li>Corporate Events</li>
              <li>Brand Launches</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-body text-xs tracking-[0.3em] uppercase text-gold mb-6">
              Reach Us
            </h4>
            <ul className="space-y-4 font-body text-sm">
              <li className="flex items-start gap-3">
                <Phone size={14} className="text-gold mt-1 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-primary-foreground/65">+91 99101 05734</span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={14} className="text-gold mt-1 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-primary-foreground/65">
                  collectives@themagicorn.com
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={14} className="text-gold mt-1 flex-shrink-0" strokeWidth={1.5} />
                <span className="text-primary-foreground/65">
                  Noida, Uttar Pradesh, India
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gold/10">
        <div className="container mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-primary-foreground/50 text-xs font-body tracking-wider">
            © {currentYear} The Magicorn Collectives. All rights reserved.
          </p>
          <p className="text-primary-foreground/40 text-xs font-body tracking-[0.2em] uppercase">
            Precision · Elegance · Trust
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
