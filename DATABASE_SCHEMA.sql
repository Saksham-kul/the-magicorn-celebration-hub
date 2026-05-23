-- Supabase Database Schema for Magicorn Media Studio
-- Run these SQL commands in the Supabase SQL editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql)

-- Create categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  slug VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create media table
CREATE TABLE media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  cloudinary_url TEXT NOT NULL,
  cloudinary_public_id VARCHAR(255) NOT NULL UNIQUE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  folder VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  uploaded_at TIMESTAMP DEFAULT NOW(),
  starred BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  CONSTRAINT media_valid_urls CHECK (cloudinary_url != '')
);

-- Create indexes for performance
CREATE INDEX idx_media_category_id ON media(category_id);
CREATE INDEX idx_media_created_at ON media(created_at DESC);
CREATE INDEX idx_media_folder ON media(folder);
CREATE INDEX idx_media_starred ON media(starred);
CREATE INDEX idx_categories_slug ON categories(slug);

-- Enable RLS (Row Level Security)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (modify as needed for your security requirements)
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public can read media" ON media FOR SELECT USING (true);

-- For authenticated users to insert/update/delete, add these policies:
-- CREATE POLICY "Authenticated users can insert categories" ON categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can update categories" ON categories FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can delete categories" ON categories FOR DELETE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can insert media" ON media FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can update media" ON media FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Authenticated users can delete media" ON media FOR DELETE USING (auth.role() = 'authenticated');

-- Since we're using custom password auth, modify the policies like this instead:
-- Allow all for development (comment out for production)
CREATE POLICY "Allow all for media" ON media USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for categories" ON categories USING (true) WITH CHECK (true);
