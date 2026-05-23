import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Tag,
  Pencil,
  Check,
} from "lucide-react";
import {
  ACCEPTED_EXT,
  ACCEPTED_TYPES,
  MAX_BYTES,
  formatBytes,
  uploadToCloudinary,
} from "@/lib/cloudinary";
import { useMediaStore } from "@/lib/mediaStore";
import { toast } from "sonner";

type Item = {
  id: string;
  file: File;
  name: string;           // editable display name
  categoryId: string;     // editable category
  preview: string;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
  editingName: boolean;
};

export default function UploadDialog({
  open,
  onClose,
  folder,
}: {
  open: boolean;
  onClose: () => void;
  folder?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [dragOver, setDragOver] = useState(false);
  // Global category applied to all files (can be overridden per-file)
  const [globalCategory, setGlobalCategory] = useState<string>("");

  const addMedia = useMediaStore((s) => s.addMedia);
  const categories = useMediaStore((s) => s.categories);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const list = Array.from(files);
      const valid: Item[] = [];
      list.forEach((f) => {
        if (!ACCEPTED_TYPES.includes(f.type)) {
          toast.error(`${f.name}: unsupported format`);
          return;
        }
        if (f.size > MAX_BYTES) {
          toast.error(`${f.name}: exceeds ${formatBytes(MAX_BYTES)}`);
          return;
        }
        valid.push({
          id: crypto.randomUUID(),
          file: f,
          name: f.name.replace(/\.[^.]+$/, ""),
          categoryId: globalCategory,
          preview: URL.createObjectURL(f),
          progress: 0,
          status: "queued",
          editingName: false,
        });
      });
      setItems((prev) => [...prev, ...valid]);
    },
    [globalCategory]
  );

  const remove = (id: string) =>
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });

  const updateItem = (id: string, patch: Partial<Item>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));

  // Apply global category to all queued items
  const applyGlobalCategory = (catId: string) => {
    setGlobalCategory(catId);
    setItems((prev) =>
      prev.map((i) => (i.status === "queued" ? { ...i, categoryId: catId } : i))
    );
  };

  const startUpload = async () => {
    const queued = items.filter((i) => i.status === "queued");
    await Promise.all(
      queued.map(async (item) => {
        updateItem(item.id, { status: "uploading" });
        try {
          const asset = await uploadToCloudinary(item.file, {
            folder,
            onProgress: (loaded, total) => {
              updateItem(item.id, { progress: (loaded / total) * 100 });
            },
          });

          await addMedia({
            name: item.name.trim() || item.file.name.replace(/\.[^.]+$/, ""),
            cloudinary_url: asset.secure_url,
            cloudinary_public_id: asset.public_id,
            category_id: item.categoryId || null,
            folder: folder,
            uploaded_at: new Date().toISOString(),
            metadata: {
              original_filename: item.file.name,
              size: item.file.size,
              type: item.file.type,
            },
          });

          updateItem(item.id, { status: "done", progress: 100 });
        } catch (e: any) {
          updateItem(item.id, { status: "error", error: e.message });
        }
      })
    );
    toast.success("Upload complete");
  };

  const close = () => {
    items.forEach((i) => URL.revokeObjectURL(i.preview));
    setItems([]);
    setGlobalCategory("");
    onClose();
  };

  if (!open) return null;
  const hasQueued = items.some((i) => i.status === "queued");

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-purple-deep/80 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={close}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="bg-card border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-elevated"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div>
              <p className="eyebrow mb-1">Upload</p>
              <h2 className="font-display text-2xl text-foreground">New Media</h2>
              {folder && (
                <p className="text-xs text-muted-foreground mt-1">→ {folder}</p>
              )}
            </div>
            <button
              onClick={close}
              className="w-9 h-9 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* Drop zone */}
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
              }}
              className={`relative block rounded-xl border-2 border-dashed transition-all cursor-pointer p-8 text-center ${
                dragOver
                  ? "border-gold bg-gold/5"
                  : "border-border hover:border-gold/50 hover:bg-muted/30"
              }`}
            >
              <input
                type="file"
                multiple
                accept={ACCEPTED_EXT}
                className="sr-only"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
              <motion.div
                animate={{ y: dragOver ? -4 : 0 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                  <UploadCloud className="w-6 h-6 text-gold" />
                </div>
                <div>
                  <p className="font-display text-lg text-foreground">
                    Drop files or{" "}
                    <span className="text-gold underline underline-offset-4">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
                    JPG · PNG · WebP · SVG · GIF · MP4 · max {formatBytes(MAX_BYTES)}
                  </p>
                </div>
              </motion.div>
            </label>

            {/* Global category picker — shown as soon as files are added */}
            {items.length > 0 && (
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gold/20 bg-gold/5">
                <Tag className="w-4 h-4 text-gold shrink-0" />
                <span className="text-xs uppercase tracking-wider text-muted-foreground shrink-0">
                  Apply category to all:
                </span>
                <select
                  value={globalCategory}
                  onChange={(e) => applyGlobalCategory(e.target.value)}
                  className="flex-1 bg-transparent text-sm text-foreground border border-border rounded-md px-2 py-1.5 focus:outline-none focus:border-gold/50 transition"
                >
                  <option value="">— No category —</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* File list */}
            {items.length > 0 && (
              <div className="space-y-3">
                {items.map((item) => {
                  const isVideo = item.file.type.startsWith("video/");
                  const catName =
                    categories.find((c) => c.id === item.categoryId)?.name || "";
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="rounded-lg border border-border bg-card-foreground/5 overflow-hidden"
                    >
                      <div className="flex items-center gap-3 p-3">
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
                          {isVideo ? (
                            <FileVideo className="w-5 h-5 text-muted-foreground" />
                          ) : (
                            <img
                              src={item.preview}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          )}
                        </div>

                        {/* Name + size */}
                        <div className="flex-1 min-w-0">
                          {item.editingName ? (
                            <div className="flex items-center gap-1">
                              <input
                                autoFocus
                                value={item.name}
                                onChange={(e) =>
                                  updateItem(item.id, { name: e.target.value })
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter" || e.key === "Escape")
                                    updateItem(item.id, { editingName: false });
                                }}
                                onBlur={() =>
                                  updateItem(item.id, { editingName: false })
                                }
                                className="flex-1 bg-transparent border-b border-gold text-sm text-foreground outline-none"
                              />
                              <button
                                onClick={() =>
                                  updateItem(item.id, { editingName: false })
                                }
                                className="text-gold p-0.5"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 min-w-0">
                              <p className="text-sm text-foreground truncate">
                                {item.name}
                              </p>
                              {item.status === "queued" && (
                                <button
                                  onClick={() =>
                                    updateItem(item.id, { editingName: true })
                                  }
                                  className="text-muted-foreground hover:text-gold shrink-0"
                                >
                                  <Pencil className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatBytes(item.file.size)}
                          </p>

                          {/* Progress bar */}
                          <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              className={`h-full ${
                                item.status === "error"
                                  ? "bg-destructive"
                                  : "bg-gold"
                              }`}
                              animate={{ width: `${item.progress}%` }}
                              transition={{ duration: 0.2 }}
                            />
                          </div>
                          {item.error && (
                            <p className="text-xs text-destructive mt-1">
                              {item.error}
                            </p>
                          )}
                        </div>

                        {/* Status / remove */}
                        {item.status === "done" ? (
                          <CheckCircle2 className="w-5 h-5 text-gold shrink-0" />
                        ) : item.status === "error" ? (
                          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
                        ) : (
                          <button
                            onClick={() => remove(item.id)}
                            className="text-muted-foreground hover:text-destructive shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      {/* Per-file category override */}
                      {item.status === "queued" && (
                        <div className="px-3 pb-3 flex items-center gap-2">
                          <Tag className="w-3 h-3 text-muted-foreground shrink-0" />
                          <select
                            value={item.categoryId}
                            onChange={(e) =>
                              updateItem(item.id, { categoryId: e.target.value })
                            }
                            className="flex-1 bg-muted/40 text-xs text-foreground border border-border rounded px-2 py-1 focus:outline-none focus:border-gold/50 transition"
                          >
                            <option value="">— No category —</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                          {catName && (
                            <span className="text-[10px] tracking-wider uppercase text-gold shrink-0">
                              {catName}
                            </span>
                          )}
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-border flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {items.length} file{items.length === 1 ? "" : "s"} selected
            </p>
            <div className="flex gap-2">
              <button
                onClick={close}
                className="px-5 h-10 rounded-md text-sm text-muted-foreground hover:text-foreground transition"
              >
                Close
              </button>
              <button
                onClick={startUpload}
                disabled={!hasQueued}
                className="px-6 h-10 rounded-md border border-gold text-gold text-xs uppercase tracking-[0.2em] hover:bg-gold/10 hover:shadow-gold transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Upload
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
