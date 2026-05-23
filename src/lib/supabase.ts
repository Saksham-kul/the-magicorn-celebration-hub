import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    'Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

// Type definitions for database schema
export interface MediaItem {
  id: string;
  name: string;
  cloudinary_url: string;
  cloudinary_public_id: string;
  category_id: string | null;
  category_name?: string | null;
  folder?: string;
  created_at: string;
  uploaded_at: string;
  starred?: boolean;
  metadata?: Record<string, any>;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

// Database operations
export const mediaDB = {
  async getAll(): Promise<MediaItem[]> {
    const { data, error } = await supabase
      .from('media')
      .select('*, categories(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((item: any) => ({
      ...item,
      category_name: item.categories?.name || null,
    }));
  },

  async getByCategory(categoryId: string): Promise<MediaItem[]> {
    const { data, error } = await supabase
      .from('media')
      .select('*, categories(name)')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((item: any) => ({
      ...item,
      category_name: item.categories?.name || null,
    }));
  },

  async create(media: Omit<MediaItem, 'id' | 'created_at'>): Promise<MediaItem> {
    const { data, error } = await supabase
      .from('media')
      .insert([
        {
          name: media.name,
          cloudinary_url: media.cloudinary_url,
          cloudinary_public_id: media.cloudinary_public_id,
          category_id: media.category_id,
          folder: media.folder,
          uploaded_at: new Date().toISOString(),
          metadata: media.metadata || {},
        },
      ])
      .select('*, categories(name)')
      .single();

    if (error) throw error;
    return {
      ...data,
      category_name: data.categories?.name || null,
    };
  },

  async update(
    id: string,
    updates: Partial<Omit<MediaItem, 'id' | 'created_at' | 'uploaded_at'>>
  ): Promise<MediaItem> {
    const { data, error } = await supabase
      .from('media')
      .update(updates)
      .eq('id', id)
      .select('*, categories(name)')
      .single();

    if (error) throw error;
    return {
      ...data,
      category_name: data.categories?.name || null,
    };
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('media').delete().eq('id', id);
    if (error) throw error;
  },

  async deleteMany(ids: string[]): Promise<void> {
    const { error } = await supabase.from('media').delete().in('id', ids);
    if (error) throw error;
  },
};

export const categoryDB = {
  async getAll(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data || [];
  },

  async create(name: string): Promise<Category> {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name, slug }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, name: string): Promise<Category> {
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const { data, error } = await supabase
      .from('categories')
      .update({ name, slug })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) throw error;
  },
};

