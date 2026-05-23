import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Download, Pencil, Trash2, Star, Wand2, Check } from "lucide-react";
import { type MediaItem } from "@/lib/supabase";
import { useMediaStore } from "@/lib/mediaStore";
import { CLOUD_NAME, formatBytes } from "@/lib/cloudinary";
import { toast } from "sonner";

const PRESETS: { label: string; transform: string }[] = [
  { label: "Original", transform: "" },
  { label: "Thumbnail 400", transform: "w_400,c_fill,q_auto,f_auto" },
  { label: "Web 1200", transform: "w_1200,c_limit,q_auto,f_auto" },
  { label: "Hero 1920", transform: "w_1920,c_limit,q_auto,f_auto" },
  { label: "Square 800", transform: "w_800,h_800,c_fill,g_auto,q_auto,f_auto" },
  { label: "Avatar 200", transform: "w_200,h_200,c_fill,g_face,r_max,q_auto,f_auto" },
];

function buildTransformedUrl(publicId: string, transform: string) {
  const t = transform ? `${transform}/` : "";
  // Detect resource type from the public_id or URL
  const resourceType = publicId.includes("video") ? "video" : "image";
  const ext = publicId.split(".").pop() || "jpg";
  const id = publicId.includes(".") ? publicId : publicId;
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${t}${id}`;
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
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [transform, setTransform] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const updateMedia = useMediaStore((s) => s.updateMedia);

  if (!media) return null;

  const displayName = media.name;
  const isVideo = media.cloudinary_url.includes("/video/");
  const publicId = media.cloudinary_public_id;
  const transformedUrl = transform
    ? buildTransformedUrl(publicId, transform)
    : media.cloudinary_url;

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 1500);
  };

  const startRename = () => {
    setName(displayName);
    setEditing(true);
  };

  const saveRename = () => {
    updateMedia(media.id, { name: name.trim() || displayName });
    setEditing(false);
    toast.success("Renamed");
  };

  const download = () => {
    const a = document.createElement("a");
    a.href = transformedUrl;
    a.download = displayName;
    a.target = "_blank";
    a.click();
  };

  const size = media.metadata?.size as number | undefined;
  const width = media.metadata?.width as number | undefined;
  const height = media.metadata?.height as number | undefined;

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
          className="ml-auto w-full max-w-xl h-full bg-card border-l border-gold/20 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 z-10 flex items-center justify-between p-5 border-b border-border bg-card/95 backdrop-blur">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="min-w-0">
                <p className="eyebrow">Asset</p>
                {editing ? (
                  <div className="flex gap-1 items-center mt-0.5">
                    <input
                      autoFocus
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && saveRename()}
                      className="font-display text-lg bg-transparent border-b border-gold outline-none text-foreground w-48"
                    />
                    <button onClick={saveRename} className="text-gold p-1">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <h3 className="font-display text-lg text-foreground truncate">
                    {displayName}
                  </h3>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => updateMedia(media.id, { starred: !media.starred })}
                className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-gold"
                title="Star"
              >
                <Star className={`w-4 h-4 ${media.starred ? "fill-gold text-gold" : ""}`} />
              </button>
              <button
                onClick={startRename}
                className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground"
                title="Rename"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  onDelete(media.id);
                  onClose();
                }}
                className="w-9 h-9 rounded-full hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"
                title="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="rounded-xl overflow-hidden border border-border bg-purple-deep/5">
              {isVideo ? (
                <video src={media.cloudinary_url} controls className="w-full max-h-[400px]" />
              ) : (
                <img
                  src={transformedUrl}
                  alt={displayName}
                  className="w-full max-h-[400px] object-contain bg-purple-deep/5"
                />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <Field label="Type" value={isVideo ? "VIDEO" : "IMAGE"} />
              <Field label="Category" value={media.category_name || "Uncategorized"} />
              <Field label="Size" value={size ? formatBytes(size) : "—"} />
              <Field
                label="Dimensions"
                value={width && height ? `${width} × ${height}` : "—"}
              />
              <Field
                label="Uploaded"
                value={new Date(media.uploaded_at || media.created_at).toLocaleString()}
              />
              <Field label="Folder" value={media.folder || "Root"} />
            </div>

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
                    {copied === "url" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy
                  </button>
                </div>
              </div>
            )}

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
                {copied === "id" ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
