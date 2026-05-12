import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CloudinaryAsset } from "./cloudinary";

export type Folder = { id: string; name: string; parentId: string | null };

type State = {
  assets: CloudinaryAsset[];
  folders: Folder[];
  isInitialized: boolean;
  addAsset: (a: CloudinaryAsset) => void;
  addAssets: (a: CloudinaryAsset[]) => void;
  removeAssets: (ids: string[]) => void;
  updateAsset: (id: string, patch: Partial<CloudinaryAsset>) => void;
  toggleStar: (id: string) => void;
  moveAssets: (ids: string[], folder: string | undefined) => void;
  addFolder: (name: string, parentId: string | null) => void;
  renameFolder: (id: string, name: string) => void;
  removeFolder: (id: string) => void;
  setAssets: (a: CloudinaryAsset[]) => void;
  setFolders: (f: Folder[]) => void;
  setInitialized: (v: boolean) => void;
};

export const useMediaStore = create<State>()(
  persist(
    (set) => ({
      assets: [],
      folders: [],
      isInitialized: false,
      addAsset: (a) =>
        set((s) => ({ assets: [a, ...s.assets.filter((x) => x.public_id !== a.public_id)] })),
      addAssets: (a) =>
        set((s) => {
          const ids = new Set(a.map((x) => x.public_id));
          return { assets: [...a, ...s.assets.filter((x) => !ids.has(x.public_id))] };
        }),
      removeAssets: (ids) =>
        set((s) => ({ assets: s.assets.filter((a) => !ids.includes(a.public_id)) })),
      updateAsset: (id, patch) =>
        set((s) => ({
          assets: s.assets.map((a) => (a.public_id === id ? { ...a, ...patch } : a)),
        })),
      toggleStar: (id) =>
        set((s) => ({
          assets: s.assets.map((a) =>
            a.public_id === id ? { ...a, starred: !a.starred } : a
          ),
        })),
      moveAssets: (ids, folder) =>
        set((s) => ({
          assets: s.assets.map((a) =>
            ids.includes(a.public_id) ? { ...a, folder } : a
          ),
        })),
      addFolder: (name, parentId) =>
        set((s) => ({
          folders: [
            ...s.folders,
            { id: crypto.randomUUID(), name: name.trim(), parentId },
          ],
        })),
      renameFolder: (id, name) =>
        set((s) => ({
          folders: s.folders.map((f) => (f.id === id ? { ...f, name } : f)),
        })),
      removeFolder: (id) =>
        set((s) => ({ folders: s.folders.filter((f) => f.id !== id) })),
      setAssets: (a) => set({ assets: a }),
      setInitialized: (v) => set({ isInitialized: v }),
      setFolders: (f) => set({ folders: f }),
    }),
    { name: "magicorn-media-studio" }
  )
);

export function folderPath(folders: Folder[], id: string | null): string {
  if (!id) return "";
  const parts: string[] = [];
  let cur = folders.find((f) => f.id === id);
  while (cur) {
    parts.unshift(cur.name);
    cur = cur.parentId ? folders.find((f) => f.id === cur!.parentId) : undefined;
  }
  return parts.join("/");
}

/**
 * Reconstruct folder hierarchy from asset folder paths.
 * This allows folders to persist across browser sessions by extracting
 * folder structure from Cloudinary asset metadata.
 */
export function reconstructFoldersFromAssets(assets: CloudinaryAsset[]): Folder[] {
  const folderPaths = new Set<string>();
  
  // Collect all unique folder paths from assets
  assets.forEach((asset) => {
    if (asset.folder) {
      folderPaths.add(asset.folder);
      // Also add parent directories
      // e.g., for "website/government/subfolder", add "website" and "website/government"
      const parts = asset.folder.split("/");
      for (let i = 1; i < parts.length; i++) {
        folderPaths.add(parts.slice(0, i).join("/"));
      }
    }
  });

  const folders: Folder[] = [];
  const pathToId = new Map<string, string>();

  // Create folder objects for each path
  Array.from(folderPaths)
    .sort() // Sort to ensure parents are created before children
    .forEach((path) => {
      const parts = path.split("/");
      const name = parts[parts.length - 1];
      const parentPath = parts.slice(0, -1).join("/");
      const parentId = parentPath ? pathToId.get(parentPath) : null;
      
      const id = crypto.randomUUID();
      pathToId.set(path, id);
      
      folders.push({
        id,
        name,
        parentId: parentId || null,
      });
    });

  return folders;
}
