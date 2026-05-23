import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      // Get all media with folders
      const { data: media, error: mediaError } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false });

      if (mediaError) throw mediaError;

      const { data: folders, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .order('created_at', { ascending: false });

      if (foldersError) throw foldersError;

      res.setHeader('Cache-Control', 'public, max-age=60');
      res.status(200).json({ media: media || [], folders: folders || [] });
    } else if (req.method === 'POST') {
      // Add new media
      const { data, error } = await supabase
        .from('media')
        .insert([req.body])
        .select();

      if (error) throw error;
      res.status(201).json(data);
    } else if (req.method === 'PUT') {
      // Update media
      const { id, ...updates } = req.body;
      const { data, error } = await supabase
        .from('media')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      res.status(200).json(data);
    } else if (req.method === 'DELETE') {
      // Delete media
      const { id } = req.query;
      const { error } = await supabase.from('media').delete().eq('id', id);

      if (error) throw error;
      res.status(200).json({ success: true });
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error: any) {
    console.error('Media API error:', error);
    res.status(500).json({ error: error.message });
  }
}
