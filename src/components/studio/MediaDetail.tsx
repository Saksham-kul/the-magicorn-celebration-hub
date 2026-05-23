import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Copy,
  Download,
  Pencil,
  Trash2,
  Star,
  Wand2,
  Check,
  Tag,
} from "lucide-react";
import { type MediaItem } from "@/lib/supabase";
import { useMediaStore } from "@/lib/mediaStore";
import { CLOUD_NAME, formatBytes } from "@/lib/cloudinary";
import { toast } from "sonner";

const PRESETS: { label: string; transform: string }[] = [
  { label: "Original", transform: "" },
  { label: "Thumb 400", transform: "w_400,c_fill,q_auto,f_auto" },
  { label: "Web 1200", transform: "w_1200,c_limit,q_auto,f_auto" },
  { label: "Hero 1920", transform: "w_1920,c_limit,q_auto,f_auto" },
  { label: "Square 800", transform: "w_800,h_800,c_fill,g_auto,q_auto,f_auto" },
  { label: "Avatar 200", transform: "w_200,h_200,c_fill,g_face,r_max,q_auto,f_auto" },
];

function buildTransformedUrl(publicId: string, transform: string, isVideo: boolean) {
  const resourceType = isVideo ? "video" : "image";
  const t = transform ? `${transform}/` : "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${t}${publicId}`;
}

export default function MediaDetail({
  media,
  onClose,
  onDelete,
}: {
  media: MediaItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const updateMedia = useMediaStore((s) => s.updateMedia);
  const categories = useMediaStore((s) => s.categories);

  // Editable fields
  const [editingName, setEditingName] = useState(false);
  const [nameVal, setNameVal] = useState("");
  const [editingCategory, setEditingCategory] = useState(false);
  const [categoryVal, setCategoryVal] = useState("");

  // Transform
  const [transform, setTransform] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  // Reset state when a different item is opened
  useEffect(() => {
    setEditingName(false);
    setEditingCategory(false);
    setTransform("");
    if (media) {
      setNameVal(media.name);
      setCategoryVal(media.category_id || "");
    }
  }, [media?.id]);

  if (!media) return null;

  const isVideo = media.cloudinary_url.includes("/video/");
  const transformedUrl = buildTransformedUrl(
    media.cloudinary_public_id,
    transform,
    isVideo
  );

  // ── Helpers ──────────────────────────────────────────────
  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 1500);
  };

  const saveName = async () => {
    const trimmed = nameVal.trim();
    if (!trimmed || trimmed === media.name) { setEditingName(false); return; }
    await updateMedia(media.id, { name: trimmed });
    setEditingName(false);
    toast.success("Name updated");
  };

  const saveCategory = async (catId: string) => {
    setCategoryVal(catId);
    setEditingCategory(false);
    await updateMedia(media.id, { category_id: catId || null });
    toast.success("Category updated");
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = transformedUrl;
    a.download = media.name;
    a.target = "_blank";
    a.click();
  };

  const size = media.metadata?.size as number | undefined;
  const currentCatName =
    categories.find((c) => c.id === media.category_id)?.name ||
    media.category_name ||
    "Uncategorized";

  // ── Render ───────────────────────────────────────────────
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[55] bg-purple-deep/80 backdrop-blur-sm flex"
        onClick={onClose}
      >
        <motion.aside
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 250 }}
          className="ml-auto w-full max-w-xl h-full bg-card border-l border-gold/20 overflow-y-auto flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Sticky header ── */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-4 border-b border-border bg-card/95 backdrop-blur">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <p className="eyebrow text-[10px]">Asset detail</p>
                {editingName ? (
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      autoFocus
                      value={nameVal}
                      onChange={(e) => setNameVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveName();
                        if (e.key === "Escape") setEditingName(false);
                      }}
                      className="font-display text-base bg-transparent border-b border-gold outline-none text-foreground w-44"
                    />
                    <button onClick={saveName} className="text-gold p-1">
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setEditingName(false)}
                      className="text-muted-foreground p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 min-w-0">
                    <h3 className="font-display text-base text-foreground truncate max-w-[160px]">
                      {media.name}
                    </h3>
                    <button
                      onClick={() => { setNameVal(media.name); setEditingName(true); }}
                      className="text-muted-foreground hover:text-gold shrink-0"
                      title="Rename"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => updateMedia(media.id, { starred: !media.starred })}
                className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-gold"
                title={media.starred ? "Unstar" : "Star"}
              >
                <Star className={`w-4 h-4 ${media.starred ? "fill-gold text-gold" : ""}`} />
              </button>
              <button
                onClick={() => { onDelete(media.id); onClose(); }}
                className="w-9 h-9 rounded-full hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Body ── */}
          <div className="p-6 space-y-6 flex-1">
            {/* Preview */}
            <div className="rounded-xl overflow-hidden border border-border bg-purple-deep/5">
              {isVideo ? (
                <video
                  src={media.cloudinary_url}
                  controls
                  className="w-full max-h-[360px]"
                />
              ) : (
                <img
                  src={transformedUrl}
                  alt={media.name}
                  className="w-full max-h-[360px] object-contain bg-purple-deep/5"
                />
              )}
            </div>

            {/* ── Editable metadata ── */}
            <div className="space-y-3">
              {/* Name row */}
              <div className="rounded-lg border border-border p-3 bg-muted/30 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
                    Name
                  </p>
                  {editingName ? (
                    <div className="flex items-center gap-1">
                      <input
                        autoFocus
                        value={nameVal}
                        onChange={(e) => setNameVal(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveName();
                          if (e.key === "Escape") setEditingName(false);
                        }}
                        className="bg-transparent text-sm text-foreground border-b border-gold outline-none flex-1"
                      />
                      <button onClick={saveName} className="text-gold p-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-foreground truncate">{media.name}</p>
                  )}
                </div>
                {!editingName && (
                  <button
                    onClick={() => { setNameVal(media.name); setEditingName(true); }}
                    className="text-muted-foreground hover:text-gold shrink-0"
                    title="Rename"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Category row */}
              <div className="rounded-lg border border-border p-3 bg-muted/30 flex items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
                    Category
                  </p>
                  {editingCategory ? (
                    <select
                      autoFocus
                      value={categoryVal}
                      onChange={(e) => saveCategory(e.target.value)}
                      onBlur={() => setEditingCategory(false)}
                      className="w-full bg-transparent text-sm text-foreground border border-gold/50 rounded px-2 py-1 focus:outline-none"
                    >
                      <option value="">— No category —</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-gold shrink-0" />
                      <p className="text-sm text-foreground truncate">
                        {currentCatName}
                      </p>
                    </div>
                  )}
                </div>
                {!editingCategory && (
                  <button
                    onClick={() => {
                      setCategoryVal(media.category_id || "");
                      setEditingCategory(true);
                    }}
                    className="text-muted-foreground hover:text-gold shrink-0"
                    title="Change category"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Read-only info grid */}
            <div className="grid grid-cols-2 gap-3">
              <Field label="Type" value={isVideo ? "VIDEO" : "IMAGE"} />
              <Field
                label="Size"
                value={size ? formatBytes(size) : "—"}
              />
              <Field
                label="Uploaded"
                value={new Date(
                  media.uploaded_at || media.created_at
                ).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              />
              <Field label="Folder" value={media.folder || "Root"} />
            </div>

            {/* CDN Transformations (images only) */}
            {!isVideo && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Wand2 className="w-4 h-4 text-gold" />
                  <p className="eyebrow">CDN Transformations</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => setTransform(p.transform)}
                      className={`px-3 py-1.5 rounded-full text-xs border transition ${
                        transform === p.transform
                          ? "border-gold bg-gold/10 text-gold"
                          : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 items-stretch">
                  <input
                    value={transformedUrl}
                    readOnly
                    className="flex-1 px-3 py-2 bg-muted rounded-md text-xs font-mono text-foreground border border-border min-w-0"
                  />
                  <button
                    onClick={() => copy(transformedUrl, "url")}
                    className="px-4 rounded-md border border-gold text-gold text-xs uppercase tracking-wider hover:bg-gold/10 transition flex items-center gap-1.5"
                  >
                    {copied === "url" ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    Copy
                  </button>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-2">
              <button
                onClick={download}
                className="flex-1 h-11 rounded-md border border-gold text-gold text-xs uppercase tracking-[0.2em] hover:bg-gold/10 hover:shadow-gold transition flex items-center justify-center gap-2"
              >
                <Download className="w-3.5 h-3.5" />
                Download
              </button>
              <button
                onClick={() => copy(media.cloudinary_public_id, "id")}
                className="flex-1 h-11 rounded-md border border-border text-muted-foreground text-xs uppercase tracking-[0.2em] hover:border-gold/40 hover:text-foreground transition flex items-center justify-center gap-2"
              >
                {copied === "id" ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                Public ID
              </button>
            </div>
          </div>
        </motion.aside>
      </motion.div>
    </AnimatePresence>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border p-3 bg-muted/30">
      <p className="text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-1">
        {label}
      </p>
      <p className="text-sm text-foreground truncate">{value}</p>
    </div>
  );
}
