import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Home", to: "/", section: "top" },
  { name: "About", to: "/", section: "about" },
  { name: "Services", to: "/", section: "services" },
  { name: "Catalogue", to: "/", section: "catalogue" },
  { name: "Contact", to: "/", section: "contact" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60);

      if (!isHome) return;
      const sections = ["about", "services", "catalogue", "contact"];
      const offset = 120;
      let current = "top";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isHome]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleNav = (e: React.MouseEvent, section: string) => {
    if (!isHome) {
      // Navigate home then scroll
      return; // let Link handle navigation; scroll handled via hash effect
    }
    e.preventDefault();
    if (section === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(section);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-purple-deep/95 backdrop-blur-md border-b border-gold/10 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          onClick={(e) => isHome && handleNav(e, "top")}
          className="flex items-center gap-3 group"
        >
          <img
            src="/logo.png"
            alt="The Magicorn Collectives"
            className="w-10 h-10 object-contain"
          />
          <span className="font-display text-lg md:text-xl font-semibold text-primary-foreground tracking-[0.2em]">
            THE <span className="text-gold">MAGICORN</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = isHome && activeSection === link.section;
            return (
              <a
                key={link.name}
                href={link.section === "top" ? "/" : `/#${link.section}`}
                onClick={(e) => {
                  if (isHome) handleNav(e, link.section);
                  else {
                    e.preventDefault();
                    navigate("/");
                    setTimeout(() => {
                      if (link.section === "top") window.scrollTo({ top: 0 });
                      else {
                        const el = document.getElementById(link.section);
                        if (el) {
                          const top =
                            el.getBoundingClientRect().top + window.scrollY - 80;
                          window.scrollTo({ top, behavior: "smooth" });
                        }
                      }
                    }, 50);
                  }
                }}
                className={`relative font-body text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                  isActive
                    ? "text-gold"
                    : "text-primary-foreground/80 hover:text-gold"
                }`}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-2 left-0 right-0 h-px bg-gold"
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden text-primary-foreground p-2"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-purple-deep/98 backdrop-blur-md border-t border-gold/10"
          >
            <nav className="container mx-auto px-6 py-8 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.section === "top" ? "/" : `/#${link.section}`}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    if (isHome) handleNav(e, link.section);
                    else {
                      e.preventDefault();
                      navigate("/");
                      setTimeout(() => {
                        if (link.section === "top")
                          window.scrollTo({ top: 0 });
                        else {
                          const el = document.getElementById(link.section);
                          if (el) {
                            const top =
                              el.getBoundingClientRect().top +
                              window.scrollY -
                              80;
                            window.scrollTo({ top, behavior: "smooth" });
                          }
                        }
                      }, 50);
                    }
                  }}
                  className="block py-3 font-body text-sm tracking-[0.25em] uppercase text-primary-foreground/80 hover:text-gold transition-colors border-b border-gold/10"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
