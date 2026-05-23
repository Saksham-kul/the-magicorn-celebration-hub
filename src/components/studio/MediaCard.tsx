import { motion } from "framer-motion";
import { Star, MoreVertical, Play, Image as ImageIcon, FileVideo } from "lucide-react";
import { type MediaItem } from "@/lib/supabase";
import { formatBytes } from "@/lib/cloudinary";

type Props = {
  media: MediaItem;
  selected: boolean;
  onSelect: (id: string, additive: boolean) => void;
  onOpen: (media: MediaItem) => void;
  onStar: (id: string) => void;
  view: "grid" | "list";
};

export default function MediaCard({ media, selected, onSelect, onOpen, onStar, view }: Props) {
  const isVideo = media.cloudinary_url.includes("video");
  const name = media.name;
  const date = new Date(media.created_at).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  if (view === "list") {
    return (
      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={(e) => onSelect(media.id, e.metaKey || e.ctrlKey || e.shiftKey)}
        onDoubleClick={() => onOpen(media)}
        className={`group flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition ${
          selected
            ? "border-gold bg-gold/5"
            : "border-border hover:border-gold/30 hover:bg-muted/30"
        }`}
      >
        <div className="w-12 h-12 rounded-md overflow-hidden bg-muted shrink-0 relative">
          <img src={media.cloudinary_url} loading="lazy" className="w-full h-full object-cover" alt={name} />
          {isVideo && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <Play className="w-3 h-3 text-white fill-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{name}</p>
          <p className="text-xs text-muted-foreground">{media.category_name || "Uncategorized"}</p>
        </div>
        <div className="hidden md:block w-24 text-xs text-muted-foreground">
          {media.metadata?.size ? formatBytes(media.metadata.size as number) : "-"}
        </div>
        <div className="hidden md:block w-28 text-xs text-muted-foreground">{date}</div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStar(media.id);
          }}
          className="text-muted-foreground hover:text-gold transition"
        >
          <Star className={`w-4 h-4 ${media.starred ? "fill-gold text-gold" : ""}`} />
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      onClick={(e) => onSelect(media.id, e.metaKey || e.ctrlKey || e.shiftKey)}
      onDoubleClick={() => onOpen(media)}
      className={`group relative rounded-xl overflow-hidden border bg-card cursor-pointer transition-all ${
        selected
          ? "border-gold shadow-gold"
          : "border-border hover:border-gold/40 hover:shadow-card"
      }`}
    >
      <div className="aspect-square bg-muted relative overflow-hidden">
        <img
          src={media.cloudinary_url}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          alt={name}
        />
        {isVideo && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition">
            <div className="w-12 h-12 rounded-full bg-gold/90 flex items-center justify-center">
              <Play className="w-5 h-5 text-purple-deep fill-purple-deep" />
            </div>
          </div>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-1.5">
          <span className="bg-purple-deep/80 backdrop-blur text-[10px] tracking-wider uppercase text-primary-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
            {isVideo ? <FileVideo className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
            {media.cloudinary_public_id.split('/').pop()?.split('.').pop()?.toUpperCase() || "IMG"}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStar(media.id);
          }}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-purple-deep/70 backdrop-blur flex items-center justify-center text-primary-foreground/80 hover:text-gold transition"
        >
          <Star className={`w-3.5 h-3.5 ${media.starred ? "fill-gold text-gold" : ""}`} />
        </button>
        {selected && (
          <div className="absolute inset-0 ring-2 ring-gold ring-inset rounded-xl pointer-events-none" />
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-foreground truncate">{name}</p>
        <div className="flex items-center justify-between mt-1 text-[11px] text-muted-foreground">
          <span>{media.category_name || "Uncategorized"}</span>
          <span>{date}</span>
        </div>
      </div>
    </motion.div>
  );
}
