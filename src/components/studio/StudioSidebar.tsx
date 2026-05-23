import { useState } from "react";
import { motion } from "framer-motion";
import {
  FolderPlus,
  Image as ImageIcon,
  Star,
  Clock,
  Layers,
  Pencil,
  Trash2,
  ChevronRight,
} from "lucide-react";
import { useMediaStore } from "@/lib/mediaStore";
import { toast } from "sonner";

type View =
  | { kind: "all" }
  | { kind: "recent" }
  | { kind: "starred" }
  | { kind: "category"; id: string; name: string };

export default function StudioSidebar({
  current,
  onSelect,
}: {
  current: View;
  onSelect: (v: View) => void;
}) {
  const media = useMediaStore((s) => s.media);
  const categories = useMediaStore((s) => s.categories);
  const addCategory = useMediaStore((s) => s.addCategory);
  const updateCategory = useMediaStore((s) => s.updateCategory);
  const removeCategory = useMediaStore((s) => s.removeCategory);

  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const counts = {
    all: media.length,
    recent: media.filter(
      (m) =>
        Date.now() - new Date(m.created_at).getTime() < 7 * 24 * 60 * 60 * 1000
    ).length,
    starred: media.filter((m) => m.starred).length,
  };

  const categoryCount = (id: string) =>
    media.filter((m) => m.category_id === id).length;

  const submitCategory = async () => {
    if (!newName.trim()) return;
    try {
      await addCategory(newName.trim());
      toast.success("Category created");
    } catch {
      toast.error("Failed to create category");
    }
    setNewName("");
    setAdding(false);
  };

  const handleRename = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await updateCategory(id, editName.trim());
      toast.success("Category renamed");
    } catch {
      toast.error("Failed to rename category");
    }
    setEditing(null);
  };

  const handleDelete = async (id: string) => {
    try {
      await removeCategory(id);
      toast.success("Category removed");
    } catch {
      toast.error("Failed to remove category");
    }
  };

  const Item = ({
    icon: Icon,
    label,
    count,
    active,
    onClick,
  }: {
    icon: any;
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
  }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition group ${
        active
          ? "bg-gold/10 text-gold"
          : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground"
      }`}
    >
      <Icon className="w-4 h-4 shrink-0" />
      <span className="flex-1 text-left truncate">{label}</span>
      <span className="text-[10px] tracking-wider opacity-60">{count}</span>
    </button>
  );

  return (
    <aside className="w-64 shrink-0 bg-purple-deep border-r border-gold/10 h-full flex flex-col">
      <div className="p-5 border-b border-gold/10">
        <p className="eyebrow">Magicorn</p>
        <h1 className="font-display text-xl text-primary-foreground mt-1">
          Media <span className="text-gold italic">Studio</span>
        </h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        <Item
          icon={Layers}
          label="All Media"
          count={counts.all}
          active={current.kind === "all"}
          onClick={() => onSelect({ kind: "all" })}
        />
        <Item
          icon={Clock}
          label="Recent"
          count={counts.recent}
          active={current.kind === "recent"}
          onClick={() => onSelect({ kind: "recent" })}
        />
        <Item
          icon={Star}
          label="Starred"
          count={counts.starred}
          active={current.kind === "starred"}
          onClick={() => onSelect({ kind: "starred" })}
        />

        <div className="pt-5 pb-2 px-3 flex items-center justify-between">
          <p className="text-[10px] tracking-[0.3em] uppercase text-primary-foreground/40">
            Categories
          </p>
          <button
            onClick={() => setAdding(true)}
            className="text-primary-foreground/40 hover:text-gold transition"
          >
            <FolderPlus className="w-3.5 h-3.5" />
          </button>
        </div>

        {adding && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="px-3 mb-2"
          >
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitCategory();
                if (e.key === "Escape") {
                  setAdding(false);
                  setNewName("");
                }
              }}
              onBlur={submitCategory}
              placeholder="Category name"
              className="w-full bg-primary-foreground/5 border border-gold/20 rounded-md px-2 py-1.5 text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:outline-none focus:border-gold/50"
            />
          </motion.div>
        )}

        {categories.length === 0 && !adding && (
          <p className="px-3 py-2 text-[11px] text-primary-foreground/30 italic">
            No categories yet
          </p>
        )}

        {categories.map((cat) => {
          const active = current.kind === "category" && current.id === cat.id;
          return (
            <div key={cat.id} className="group/cat relative">
              {editing === cat.id ? (
                <div className="px-3">
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(cat.id);
                      if (e.key === "Escape") setEditing(null);
                    }}
                    onBlur={() => {
                      if (editName.trim()) handleRename(cat.id);
                      else setEditing(null);
                    }}
                    className="w-full bg-primary-foreground/5 border border-gold/20 rounded-md px-2 py-1.5 text-sm text-primary-foreground"
                  />
                </div>
              ) : (
                <button
                  onClick={() => onSelect({ kind: "category", id: cat.id, name: cat.name })}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                    active
                      ? "bg-gold/10 text-gold"
                      : "text-primary-foreground/70 hover:bg-primary-foreground/5 hover:text-primary-foreground"
                  }`}
                >
                  <ImageIcon className="w-4 h-4 shrink-0" />
                  <span className="flex-1 text-left truncate">{cat.name}</span>
                  <span className="text-[10px] tracking-wider opacity-60 group-hover/cat:opacity-0 transition">
                    {categoryCount(cat.id)}
                  </span>
                  <span className="absolute right-2 flex gap-0.5 opacity-0 group-hover/cat:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditing(cat.id);
                        setEditName(cat.name);
                      }}
                      className="p-1 hover:text-gold"
                    >
                      <Pencil className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(cat.id);
                      }}
                      className="p-1 hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gold/10">
        <a
          href="/"
          className="flex items-center gap-2 text-[11px] tracking-[0.25em] uppercase text-primary-foreground/40 hover:text-gold transition"
        >
          <ChevronRight className="w-3 h-3 rotate-180" />
          Back to site
        </a>
      </div>
    </aside>
  );
}

export type { View as StudioView };
