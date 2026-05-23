# Supabase Integration Setup Guide

## Step 1: Set Up Supabase

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or use the existing one: `db.bsfcoozqsvycojxolfln.supabase.co`
3. Navigate to **Settings > API** and copy your credentials:
   - Project URL (VITE_SUPABASE_URL)
   - Anon Key (VITE_SUPABASE_ANON_KEY)
   - Service Role Key (for backend operations only, if needed)

## Step 2: Create Database Schema

1. In Supabase, go to **SQL Editor** → **New Query**
2. Paste the contents from `DATABASE_SCHEMA.sql` file in this project
3. Click **Run** to create the tables and RLS policies

## Step 3: Add Environment Variables

Update your `.env` file with:

```env
VITE_SUPABASE_URL="https://bsfcoozqsvycojxolfln.supabase.co"
VITE_SUPABASE_ANON_KEY="your_anon_key_here"
VITE_ADMIN_PASSWORD="Magicorn2025"
CLOUDINARY_API_KEY="915364228359354"
CLOUDINARY_API_SECRET="NwGBzHdLmziskKVOMsgvaV5UZ44"
```

## Step 4: Install Dependencies

The required `@supabase/supabase-js` package is already in package.json. Install if not done:

```bash
npm install
# or
bun install
```

## Step 5: Update Vercel Environment Variables

1. Go to Vercel project settings
2. Add the same environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_ADMIN_PASSWORD`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

## Step 6: Test Locally

```bash
npm run dev
# or
bun run dev
```

Navigate to `/studio` and verify:
1. Media uploads work and persist
2. Categories are properly displayed
3. Images show actual names instead of IDs
4. Image viewing works in the gallery

## Key Changes Made

### Files Created:
- `src/lib/supabase.ts` - Supabase client and database operations
- `DATABASE_SCHEMA.sql` - Database schema
- `vercel.json` - SPA routing configuration

### Files Modified:
- `src/lib/mediaStore.ts` - Replaced localStorage with Supabase queries
- `src/components/studio/UploadDialog.tsx` - Saves to Supabase after Cloudinary upload
- `src/components/studio/MediaCard.tsx` - Shows proper media names from Supabase
- `src/pages/Catalogue.tsx` - Fetches media from Supabase, grouped by category
- `.env` - Added Supabase credentials

### Architecture:
- **Frontend**: React + Zustand (state management) + Supabase client SDK
- **Backend**: Supabase PostgreSQL with RLS (Row Level Security)
- **Media**: Cloudinary (hosting) + Supabase (metadata)
- **Auth**: Password-based (client-side, enhanced with Supabase auth if needed)

## Data Flow

1. **Upload**: File → Cloudinary (returns URL) → Save metadata to Supabase
2. **Display**: Fetch from Supabase → Render with Cloudinary URLs
3. **Categories**: Stored in `categories` table → Linked to media items
4. **Persistence**: All data in PostgreSQL, survives sessions/browsers/incognito

## Troubleshooting

### "Missing Supabase credentials"
- Check `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after updating .env

### "Failed to fetch media"
- Verify Supabase project is running
- Check RLS policies in Supabase dashboard
- Ensure tables exist (run DATABASE_SCHEMA.sql)

### "Images not showing"
- Verify Cloudinary URLs are correct in Supabase
- Check browser console for CORS issues
- Ensure Cloudinary API key is valid

### "Vercel 404 on dynamic routes"
- Verify vercel.json is in root with SPA rewrites
- Redeploy after updating vercel.json

## Security Notes

- RLS policies allow public read access by default for development
- Use Supabase authentication for production
- API Secret should never be exposed to client
- Consider implementing JWT-based auth for admin operations
