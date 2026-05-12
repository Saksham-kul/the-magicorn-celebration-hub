const KEY = "magicorn-studio-auth";
const TTL = 1000 * 60 * 60 * 8; // 8h
export const STUDIO_ROUTE = "/studio/media-control-x9";
export const STUDIO_DIRECT_URL = `/?studioRoute=${encodeURIComponent(STUDIO_ROUTE)}`;

// NOTE: VITE_* env vars are baked into the client bundle at build time, so they
// provide no real secrecy. Using a fallback constant ensures the studio works in
// production builds where the .env file is absent. Replace via `VITE_ADMIN_PASSWORD`
// if you want to override per-environment.
export const ADMIN_PASSWORD =
  (import.meta.env.VITE_ADMIN_PASSWORD as string) || "Magicorn2025";

export function isUnlocked(): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    const { t } = JSON.parse(raw);
    return Date.now() - t < TTL;
  } catch {
    return false;
  }
}

export function unlock() {
  localStorage.setItem(KEY, JSON.stringify({ t: Date.now() }));
}

export function lock() {
  localStorage.removeItem(KEY);
}
