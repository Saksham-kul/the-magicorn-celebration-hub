import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, X, CheckCircle2, AlertCircle, FileImage, FileVideo } from "lucide-react";
import { ACCEPTED_EXT, ACCEPTED_TYPES, MAX_BYTES, formatBytes, uploadToCloudinary } from "@/lib/cloudinary";
import { useMediaStore } from "@/lib/mediaStore";
import { toast } from "sonner";

type Item = {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: "queued" | "uploading" | "done" | "error";
  error?: string;
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
  const addAsset = useMediaStore((s) => s.addAsset);

  const addFiles = useCallback((files: FileList | File[]) => {
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
        preview: URL.createObjectURL(f),
        progress: 0,
        status: "queued",
      });
    });
    setItems((prev) => [...prev, ...valid]);
  }, []);

  const remove = (id: string) =>
    setItems((prev) => {
      const item = prev.find((i) => i.id === id);
      if (item) URL.revokeObjectURL(item.preview);
      return prev.filter((i) => i.id !== id);
    });

  const startUpload = async () => {
    const queued = items.filter((i) => i.status === "queued");
    await Promise.all(
      queued.map(async (item) => {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: "uploading" } : i))
        );
        try {
          const asset = await uploadToCloudinary(item.file, {
            folder,
            onProgress: (loaded, total) => {
              setItems((prev) =>
                prev.map((i) =>
                  i.id === item.id ? { ...i, progress: (loaded / total) * 100 } : i
                )
              );
            },
          });
          addAsset({ ...asset, folder });
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, status: "done", progress: 100 } : i
            )
          );
        } catch (e: any) {
          setItems((prev) =>
            prev.map((i) =>
              i.id === item.id ? { ...i, status: "error", error: e.message } : i
            )
          );
        }
      })
    );
    toast.success("Upload complete");
  };

  const close = () => {
    items.forEach((i) => URL.revokeObjectURL(i.preview));
    setItems([]);
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
          className="bg-card border border-gold/20 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-elevated"
          onClick={(e) => e.stopPropagation()}
        >
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

          <div className="p-6 overflow-y-auto flex-1">
            <label
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
              }}
              className={`relative block rounded-xl border-2 border-dashed transition-all cursor-pointer p-10 text-center ${
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
                    Drop files or <span className="text-gold underline underline-offset-4">browse</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">
                    JPG · PNG · WebP · SVG · GIF · MP4 · max {formatBytes(MAX_BYTES)}
                  </p>
                </div>
              </motion.div>
            </label>

            {items.length > 0 && (
              <div className="mt-6 space-y-3">
                {items.map((item) => {
                  const isVideo = item.file.type.startsWith("video/");
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-4 p-3 rounded-lg border border-border bg-card-foreground/5"
                    >
                      <div className="w-14 h-14 rounded-md overflow-hidden bg-muted flex items-center justify-center shrink-0">
                        {isVideo ? (
                          <FileVideo className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <img src={item.preview} className="w-full h-full object-cover" alt="" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm text-foreground truncate">{item.file.name}</p>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatBytes(item.file.size)}
                          </span>
                        </div>
                        <div className="mt-2 h-1 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className={`h-full ${
                              item.status === "error" ? "bg-destructive" : "bg-gold"
                            }`}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 0.2 }}
                          />
                        </div>
                        {item.error && (
                          <p className="text-xs text-destructive mt-1">{item.error}</p>
                        )}
                      </div>
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
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

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
