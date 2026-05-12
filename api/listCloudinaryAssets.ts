import { VercelRequest, VercelResponse } from '@vercel/node';

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dknec6yor';
const API_KEY = process.env.CLOUDINARY_API_KEY || '';
const API_SECRET = process.env.CLOUDINARY_API_SECRET || '';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Require API credentials
  if (!API_KEY || !API_SECRET) {
    return res.status(500).json({ error: 'Cloudinary credentials not configured' });
  }

  try {
    // Fetch resources from Cloudinary using Admin API
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/image`;
    
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Transform Cloudinary response to our CloudinaryAsset format
    const assets = (data.resources || []).map((resource: any) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      url: resource.url,
      resource_type: resource.resource_type || 'image',
      format: resource.format,
      width: resource.width,
      height: resource.height,
      bytes: resource.bytes,
      created_at: resource.created_at,
      original_filename: resource.original_filename || resource.public_id.split('/').pop(),
      folder: resource.folder,
    }));

    // Cache for 5 minutes
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.status(200).json({ assets });
  } catch (error) {
    console.error('Error listing Cloudinary assets:', error);
    res.status(500).json({ error: 'Failed to list assets' });
  }
}
