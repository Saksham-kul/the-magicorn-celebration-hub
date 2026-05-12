import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { useMediaStore } from "@/lib/mediaStore";
import { thumbUrl, type CloudinaryAsset } from "@/lib/cloudinary";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import services1 from "@/assets/services1.jpg";
import services2 from "@/assets/services2.jpeg";
import services3 from "@/assets/services3.jpeg";
import services4 from "@/assets/services4.jpeg";
import services5 from "@/assets/services5.jpeg";

const fallbackCollections = [
  { src: gallery1, name: "Executive Hampers", category: "Corporate Gifting", description: "Refined hampers curated for leadership, board members, and high-value clientele." },
  { src: services1, name: "Festive Collections", category: "Seasonal", description: "Thoughtfully composed festive sets that reflect occasion and brand intent." },
  { src: gallery3, name: "Bespoke Trousseau", category: "Custom", description: "Tailored trousseau and presentation sets crafted to specification." },
  { src: gallery2, name: "Branded Merchandise", category: "Engagement", description: "Premium branded gifting designed for employee and partner engagement." },
  { src: services2, name: "Institutional Supplies", category: "Government", description: "Compliant, scalable solutions for government and institutional orders." },
  { src: gallery4, name: "Conference Kits", category: "Events", description: "Delegate kits and conference essentials with editorial-grade finishing." },
  { src: services3, name: "Launch Editions", category: "Brand Launch", description: "Limited editions designed to elevate product launches and milestones." },
  { src: services4, name: "Engagement Sets", category: "Client Gifting", description: "Memorable client gifting designed to nurture long-term relationships." },
  { src: services5, name: "Signature Selections", category: "Premium", description: "Our most distinguished selections — refined materials, considered detail." },
];

const CataloguePage = () => {
  const folders = useMediaStore((s) => s.folders);
  const assets = useMediaStore((s) => s.assets);

  // Group uploaded image assets by folder (= category). Folders with zero
  // assets are skipped. Assets without a folder collect under "Uncategorized".
  const imageAssets = assets.filter((a) => a.resource_type === "image");

  const categoryGroups: { name: string; items: CloudinaryAsset[] }[] = folders
    .map((f) => ({
      name: f.name,
      items: imageAssets.filter((a) => a.folder === f.name),
    }))
    .filter((g) => g.items.length > 0);

  const uncategorized = imageAssets.filter(
    (a) => !a.folder || !folders.find((f) => f.name === a.folder)
  );
  if (uncategorized.length > 0) {
    categoryGroups.push({ name: "Uncategorized", items: uncategorized });
  }

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
                      key={item.public_id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.45, delay: (i % 4) * 0.06 }}
                      className="group relative aspect-[4/5] overflow-hidden rounded-sm border border-gold/15 hover:border-gold/40 transition-all duration-500"
                    >
                      <img
                        src={thumbUrl(item, 600)}
                        alt={item.display_name || item.original_filename}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/85 via-purple-deep/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                        <div className="w-6 h-px bg-gold mb-2" />
                        <p className="font-display text-sm text-primary-foreground truncate">
                          {item.display_name || item.original_filename}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          ))}

        {/* Default editorial collections (always shown if no uploads, otherwise as
            a curated showcase below the live categories) */}
        {!hasUploads && (
          <section className="py-20 lg:py-28">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {fallbackCollections.map((item, i) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                    className="group border border-gold/15 rounded-sm overflow-hidden hover:border-gold/40 transition-all duration-500"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden">
                      <img
                        src={item.src}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-purple-deep/80 via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      <div className="text-[0.65rem] tracking-[0.3em] uppercase text-gold mb-2">
                        {item.category}
                      </div>
                      <h3 className="font-display text-xl text-primary-foreground mb-3">
                        {item.name}
                      </h3>
                      <p className="font-body text-sm text-primary-foreground/65 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

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
    </div>
  );
};

export default CataloguePage;
