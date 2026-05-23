import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Grid3x3,
  List,
  Upload,
  LogOut,
  Trash2,
  X,
  Filter as FilterIcon,
  ImageOff,
} from "lucide-react";
import { toast } from "sonner";
import { isUnlocked, lock } from "@/lib/studioAuth";
import { useMediaStore } from "@/lib/mediaStore";
import { type MediaItem } from "@/lib/supabase";
import StudioGate from "@/components/studio/StudioGate";
import MediaCard from "@/components/studio/MediaCard";
import MediaDetail from "@/components/studio/MediaDetail";
import UploadDialog from "@/components/studio/UploadDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Sort = "newest" | "oldest" | "name";

export default function MediaStudio() {
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    setUnlocked(isUnlocked());
  }, []);

  if (!unlocked) return <StudioGate onUnlock={() => setUnlocked(true)} />;
  return <Dashboard onLock={() => setUnlocked(false)} />;
}

function Dashboard({ onLock }: { onLock: () => void }) {
  const media = useMediaStore((s) => s.media);
  const categories = useMediaStore((s) => s.categories);
  const fetchMedia = useMediaStore((s) => s.fetchMedia);
  const removeMediaMany = useMediaStore((s) => s.removeMediaMany);
  const updateMedia = useMediaStore((s) => s.updateMedia);

  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<Sort>("newest");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [openMedia, setOpenMedia] = useState<MediaItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string[] | null>(null);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow, noarchive";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const filtered = useMemo(() => {
    let list = [...(media || [])];

    if (categoryFilter !== "all") {
      list = list.filter((m) => m.category_id === categoryFilter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((m) => m.name.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      switch (sort) {
        case "oldest":
          return +new Date(a.created_at) - +new Date(b.created_at);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return +new Date(b.created_at) - +new Date(a.created_at);
      }
    });

    return list;
  }, [media, categoryFilter, search, sort]);

  const handleSelect = (id: string, additive: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (additive) {
        next.has(id) ? next.delete(id) : next.add(id);
      } else {
        if (next.size === 1 && next.has(id)) next.clear();
        else {
          next.clear();
          next.add(id);
        }
      }
      return next;
    });
  };

  const clearSelection = () => setSelected(new Set());

  const performDelete = async (ids: string[]) => {
    await removeMediaMany(ids);
    clearSelection();
    toast.success(`Removed ${ids.length} item${ids.length === 1 ? "" : "s"}`);
  };

  const handleStar = async (id: string) => {
    const item = media?.find((m) => m.id === id);
    if (item) {
      await updateMedia(id, { starred: !item.starred });
    }
  };

  const handleLogout = () => {
    lock();
    onLock();
  };

  return (
    <div className="h-screen flex bg-background overflow-hidden flex-col">
      <header className="border-b border-border bg-card/50 backdrop-blur px-6 py-4 flex items-center gap-4">
        <div className="min-w-0">
          <p className="eyebrow">Studio</p>
          <h2 className="font-display text-2xl text-foreground truncate">Media Manager</h2>
        </div>

        <div className="flex-1 max-w-md ml-6 relative hidden md:block">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name…"
            className="w-full h-10 pl-10 pr-4 rounded-full bg-muted/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/40 focus:bg-card transition"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <button
            onClick={() => setUploadOpen(true)}
            className="h-10 px-5 rounded-md border border-gold text-gold text-xs uppercase tracking-[0.2em] hover:bg-gold/10 hover:shadow-gold transition flex items-center gap-2"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-10 h-10 rounded-md border border-border text-muted-foreground hover:text-destructive hover:border-destructive/40 transition flex items-center justify-center"
            title="Lock studio"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="border-b border-border px-6 py-3 flex items-center gap-3 flex-wrap bg-background">
        <div className="md:hidden flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search…"
            className="w-full h-9 pl-10 pr-4 rounded-full bg-muted/60 border border-border text-sm"
          />
        </div>

        <FilterIcon className="w-3.5 h-3.5 text-muted-foreground hidden md:block" />

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="h-9 w-40 text-xs uppercase tracking-wider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sort} onValueChange={(v) => setSort(v as Sort)}>
          <SelectTrigger className="h-9 w-36 text-xs uppercase tracking-wider">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="name">Name (A–Z)</SelectItem>
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1 border border-border rounded-md p-0.5">
          <button
            onClick={() => setLayout("grid")}
            className={`w-8 h-8 rounded flex items-center justify-center transition ${
              layout === "grid"
                ? "bg-gold/10 text-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Grid3x3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setLayout("list")}
            className={`w-8 h-8 rounded flex items-center justify-center transition ${
              layout === "list"
                ? "bg-gold/10 text-gold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!media || media.length === 0 ? (
          <EmptyState onUpload={() => setUploadOpen(true)} primary />
        ) : filtered.length === 0 ? (
          <EmptyState onUpload={() => setUploadOpen(true)} />
        ) : layout === "grid" ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {filtered.map((m) => (
              <MediaCard
                key={m.id}
                media={m}
                selected={selected.has(m.id)}
                onSelect={handleSelect}
                onOpen={setOpenMedia}
                onStar={handleStar}
                view="grid"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <div className="hidden md:flex items-center gap-4 px-3 pb-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <div className="w-12" />
              <div className="flex-1">Name</div>
              <div className="w-24">Category</div>
              <div className="w-28">Uploaded</div>
              <div className="w-4" />
            </div>
            {filtered.map((m) => (
              <MediaCard
                key={m.id}
                media={m}
                selected={selected.has(m.id)}
                onSelect={handleSelect}
                onOpen={setOpenMedia}
                onStar={handleStar}
                view="list"
              />
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected.size > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", damping: 22 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-purple-deep border border-gold/30 rounded-full shadow-elevated px-3 py-2 flex items-center gap-2"
          >
            <span className="text-xs tracking-wider uppercase text-primary-foreground px-3">
              {selected.size} selected
            </span>
            <button
              onClick={() => setConfirmDelete([...selected])}
              className="h-9 px-3 rounded-md text-xs uppercase tracking-wider text-destructive hover:bg-destructive/10 transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove
            </button>
            <button
              onClick={clearSelection}
              className="w-9 h-9 rounded-md text-primary-foreground/60 hover:text-primary-foreground hover:bg-primary-foreground/5 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <UploadDialog
        open={uploadOpen}
        onClose={() => {
          setUploadOpen(false);
          fetchMedia();
        }}
      />

      <MediaDetail
        media={openMedia}
        onClose={() => setOpenMedia(null)}
        onDelete={(id) => setConfirmDelete([id])}
      />

      <AlertDialog
        open={!!confirmDelete}
        onOpenChange={(o) => !o && setConfirmDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">
              Remove media?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {confirmDelete?.length ?? 0} item
              {confirmDelete?.length === 1 ? "" : "s"}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmDelete) performDelete(confirmDelete);
                setConfirmDelete(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function EmptyState({
  onUpload,
  primary,
}: {
  onUpload: () => void;
  primary?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full min-h-[400px] flex flex-col items-center justify-center text-center px-6"
    >
      <div className="w-20 h-20 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center mb-6">
        <ImageOff className="w-7 h-7 text-gold" />
      </div>
      <p className="eyebrow mb-3">{primary ? "Welcome" : "No matches"}</p>
      <h3 className="font-display text-3xl text-foreground mb-3">
        {primary ? "Your studio awaits" : "Nothing to show here"}
      </h3>
      <div className="gold-divider mx-auto my-2" />
      <p className="text-sm text-muted-foreground max-w-md mt-3">
        {primary
          ? "Upload your first media asset and start building your library."
          : "Try adjusting your filters or search query."}
      </p>
      {primary && (
        <button
          onClick={onUpload}
          className="mt-6 h-11 px-7 rounded-md border border-gold text-gold text-xs uppercase tracking-[0.25em] hover:bg-gold/10 hover:shadow-gold transition flex items-center gap-2"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Media
        </button>
      )}
    </motion.div>
  );
}
