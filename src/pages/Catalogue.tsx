import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail, MessageCircle, X, ZoomIn } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { useMediaStore } from "@/lib/mediaStore";
import { type MediaItem } from "@/lib/supabase";

const products = [
  { image: "WhatsApp Image 2026-10-14 at 18.05.54.jpeg", name: "Coffee Hamper for Her (premium)" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.07 (1).jpeg", name: "Elegant Lakshmi & Ganesha Blessings Gift Set" },
  { image: "WhatsApp Image 2026-10-20 at 14.41.51.jpeg", name: "The Premium Couple Hamper" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.08.jpeg", name: "Diwali Aroma Hamper" },
  { image: "WhatsApp Image 2026-10-20 at 14.43.20.jpeg", name: "Women Head To Toe Hamper" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.24.jpeg", name: "Perfect Coffee Date Hamper" },
  { image: "WhatsApp Image 2026-10-20 at 14.43.43.jpeg", name: "The Dryfruit Aroma Hamper" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.32.jpeg", name: "Feng Shui Diwali Gift Hamper" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.34.jpeg", name: "Colorful Ganesha Idol" },
  { image: "WhatsApp Image 2026-10-20 at 14.44.07.jpeg", name: "The couple nazar na lag jaye coffee hamper" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.42.jpeg", name: "Hamper for Pamper" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.43 (2).jpeg", name: "Aroma Reed Diffuser Hamper" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.43.jpeg", name: "Perfect Diwali Puja Hamper" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.44 (1).jpeg", name: "Complete Diwali Celebration Hamper" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.44.jpeg", name: "Lotus Ganesha - Prosperity and Good Fortune" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.45.jpeg", name: "Baby Ganesha Diwali Gift Basket" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.46 (1).jpeg", name: "Ganesha Chocolate Hamper" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.46 (2).jpeg", name: "Godh Bharai Return Gift Hamper" },
  { image: "WhatsApp Image 2026-10-14 at 18.09.46.jpeg", name: "Good Fortune Ganesha Keepsake" },
];

const whatsappNumber = "917011200433";

// Image Viewer Modal Component
const ImageViewer = ({ media, onClose }: { media: MediaItem | null; onClose: () => void }) => {
  if (!media) return null;

  const displayName = media.name;
  const isVideo = media.cloudinary_url.includes("video");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl max-h-[90vh] w-full"
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 z-10 text-white hover:text-gold transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {isVideo ? (
          <video
            src={media.cloudinary_url}
            controls
            className="w-full h-auto rounded-lg"
          />
        ) : (
          <img
            src={media.cloudinary_url}
            alt={displayName}
            className="w-full h-auto rounded-lg"
          />
        )}

        <div className="mt-4 text-center">
          <p className="text-white font-display text-lg">{displayName}</p>
          <p className="text-white/60 text-sm mt-1">{media.category_name || "Uncategorized"}</p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const CataloguePage = () => {
  const media = useMediaStore((s) => s.media);
  const categories = useMediaStore((s) => s.categories);
  const fetchMedia = useMediaStore((s) => s.fetchMedia);
  const fetchCategories = useMediaStore((s) => s.fetchCategories);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);

  useEffect(() => {
    // Load media and categories from Supabase
    fetchMedia();
    fetchCategories();
  }, [fetchMedia, fetchCategories]);

  // Group media by category
  const categoryMap = new Map<string, MediaItem[]>();

  media.forEach((item) => {
    const key = item.category_name || "Uncategorized";
    if (!categoryMap.has(key)) categoryMap.set(key, []);
    categoryMap.get(key)!.push(item);
  });

  const categoryGroups = Array.from(categoryMap.entries())
    .map(([name, items]) => ({ name, items }))
    .filter((g) => g.items.length > 0)
    .sort((a, b) => {
      if (a.name === "Uncategorized") return 1;
      if (b.name === "Uncategorized") return -1;
      return a.name.localeCompare(b.name);
    });

  const hasUploads = categoryGroups.length > 0;

  return (
    <div className="min-h-screen bg-purple-deep">
      <Header />
      <main>
        {/* Page header */}
        <section className="pt-36 pb-16 lg:pt-44 lg:pb-20 border-b border-gold/10">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="max-w-3xl"
            >
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-xs tracking-[0.25em] uppercase text-primary-foreground/60 hover:text-gold transition-colors mb-8"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </Link>
              <span className="eyebrow">Our Catalogue</span>
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-primary-foreground mt-4 mb-6 leading-[1.1]">
                A Curated Collection of
                <br />
                <span className="text-gold">Premium Offerings</span>
              </h1>
              <div className="gold-divider mb-8" />
              <p className="font-body text-base md:text-lg text-primary-foreground/70 max-w-2xl leading-relaxed">
                Explore a selection of our gifting and event collections —
                each crafted with precision, designed to reflect elegance, and
                tailored to the occasion.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="container mx-auto px-6">
            <div className="mb-10 flex items-end justify-between gap-4 flex-wrap">
              <div>
                <span className="eyebrow">Made to delight</span>
                <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mt-3">
                  Our Product Collection
                </h2>
                <div className="gold-divider mt-4" />
              </div>
              <p className="text-xs tracking-[0.25em] uppercase text-primary-foreground/40">
                {products.length} {products.length === 1 ? "Piece" : "Pieces"}
              </p>
            </div>
            <p className="font-body text-primary-foreground/65 max-w-2xl mb-10 leading-relaxed">
              Discover thoughtful details and beautiful finds from The Magicorn.
              Have a question about a piece? Get in touch with us directly.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
              {products.map((product, index) => {
                const productName = product.name;
                const imageUrl = `/products/${encodeURIComponent(product.image)}`;
                const message = `Hi, I'm interested in ${productName}. Could you share more details?`;

                return (
                  <motion.article
                    key={product.image}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
                    className="group overflow-hidden border border-gold/15 hover:border-gold/40 transition-colors duration-500"
                  >
                    <div className="aspect-[4/5] overflow-hidden bg-purple-royal/20">
                      <img
                        src={imageUrl}
                        alt={productName}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-5">
                      <div className="w-6 h-px bg-gold mb-3" />
                      <h3 className="font-display text-lg text-primary-foreground mb-4">
                        {productName}
                      </h3>
                      <Button
                        asChild
                        className="btn-magical w-full rounded-none font-body text-[0.65rem] tracking-[0.2em]"
                      >
                        <a
                          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Ask about ${productName} on WhatsApp`}
                        >
                          <MessageCircle className="mr-2 w-4 h-4" />
                          ENQUIRE ON WHATSAPP
                        </a>
                      </Button>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Uploaded categories from the Studio */}
        {hasUploads &&
          categoryGroups.map((group, gi) => (
            <section
              key={group.name}
              className={`py-16 lg:py-20 ${gi === 0 ? "pt-20 lg:pt-24" : ""} ${
                gi !== categoryGroups.length - 1 ? "border-b border-gold/10" : ""
              }`}
            >
              <div className="container mx-auto px-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6 }}
                  className="mb-10 flex items-end justify-between flex-wrap gap-4"
                >
                  <div>
                    <span className="eyebrow">Collection</span>
                    <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mt-3">
                      {group.name}
                    </h2>
                    <div className="gold-divider mt-4" />
                  </div>
                  <p className="text-xs tracking-[0.25em] uppercase text-primary-foreground/40">
                    {group.items.length}{" "}
                    {group.items.length === 1 ? "Piece" : "Pieces"}
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                  {group.items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
                      onClick={() => setSelectedImage(item)}
                      className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-gold/15 hover:border-gold/40 transition-all duration-500 cursor-pointer"
                    >
                      <img
                        src={item.cloudinary_url}
                        alt={item.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/85 via-purple-deep/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center border border-gold/50">
                          <ZoomIn className="w-5 h-5 text-gold" />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-6 h-px bg-gold mb-2" />
                        <p className="font-display text-sm text-primary-foreground truncate">
                          {item.name}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          ))}

        {/* CTA */}
        <section className="py-20 border-t border-gold/10">
          <div className="container mx-auto px-6 text-center max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="eyebrow">Tailored Requests</span>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground mt-4 mb-6">
                Looking for something bespoke?
              </h2>
              <div className="gold-divider mx-auto mb-6" />
              <p className="font-body text-primary-foreground/70 mb-10">
                Share your requirement and our team will craft a tailored
                proposal aligned to your brand and occasion.
              </p>
              <Button
                asChild
                size="lg"
                className="btn-magical rounded-none px-10 py-6 font-body text-xs tracking-[0.25em]"
              >
                <Link to="/#contact">
                  REQUEST A PROPOSAL <Mail className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
      <AnimatePresence>
        {selectedImage && (
          <ImageViewer media={selectedImage} onClose={() => setSelectedImage(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CataloguePage;
