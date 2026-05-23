import { create } from "zustand";
import { mediaDB, categoryDB, type MediaItem, type Category } from "./supabase";

type State = {
  media: MediaItem[];
  categories: Category[];
  isLoading: boolean;
  error: string | null;
  
  // Media operations
  fetchMedia: () => Promise<void>;
  fetchMediaByCategory: (categoryId: string) => Promise<void>;
  addMedia: (media: Omit<MediaItem, "id" | "created_at">) => Promise<MediaItem>;
  updateMedia: (id: string, updates: Partial<Omit<MediaItem, "id" | "created_at" | "uploaded_at">>) => Promise<void>;
  removeMedia: (id: string) => Promise<void>;
  removeMediaMany: (ids: string[]) => Promise<void>;
  
  // Category operations
  fetchCategories: () => Promise<void>;
  addCategory: (name: string) => Promise<Category>;
  updateCategory: (id: string, name: string) => Promise<void>;
  removeCategory: (id: string) => Promise<void>;
  
  // State management
  setMedia: (media: MediaItem[]) => void;
  setCategories: (categories: Category[]) => void;
};

export const useMediaStore = create<State>((set) => ({
  media: [],
  categories: [],
  isLoading: false,
  error: null,

  // Media operations
  fetchMedia: async () => {
    try {
      set({ isLoading: true, error: null });
      const media = await mediaDB.getAll();
      set({ media });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to fetch media" });
      console.error("Error fetching media:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMediaByCategory: async (categoryId: string) => {
    try {
      set({ isLoading: true, error: null });
      const media = await mediaDB.getByCategory(categoryId);
      set({ media });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to fetch media" });
      console.error("Error fetching media by category:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addMedia: async (media) => {
    try {
      set({ isLoading: true, error: null });
      const newMedia = await mediaDB.create(media);
      set((state) => ({ media: [newMedia, ...state.media] }));
      return newMedia;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to add media" });
      console.error("Error adding media:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateMedia: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const updated = await mediaDB.update(id, updates);
      set((state) => ({
        media: state.media.map((m) => (m.id === id ? updated : m)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to update media" });
      console.error("Error updating media:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeMedia: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await mediaDB.delete(id);
      set((state) => ({ media: state.media.filter((m) => m.id !== id) }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to remove media" });
      console.error("Error removing media:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeMediaMany: async (ids) => {
    try {
      set({ isLoading: true, error: null });
      await mediaDB.deleteMany(ids);
      set((state) => ({
        media: state.media.filter((m) => !ids.includes(m.id)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to remove media" });
      console.error("Error removing media:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // Category operations
  fetchCategories: async () => {
    try {
      set({ isLoading: true, error: null });
      const categories = await categoryDB.getAll();
      set({ categories });
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to fetch categories" });
      console.error("Error fetching categories:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  addCategory: async (name) => {
    try {
      set({ isLoading: true, error: null });
      const category = await categoryDB.create(name);
      set((state) => ({ categories: [...state.categories, category] }));
      return category;
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to add category" });
      console.error("Error adding category:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  updateCategory: async (id, name) => {
    try {
      set({ isLoading: true, error: null });
      const updated = await categoryDB.update(id, name);
      set((state) => ({
        categories: state.categories.map((c) => (c.id === id ? updated : c)),
      }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to update category" });
      console.error("Error updating category:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  removeCategory: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await categoryDB.delete(id);
      set((state) => ({ categories: state.categories.filter((c) => c.id !== id) }));
    } catch (error) {
      set({ error: error instanceof Error ? error.message : "Failed to remove category" });
      console.error("Error removing category:", error);
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  // State management
  setMedia: (media) => set({ media }),
  setCategories: (categories) => set({ categories }),
}));
