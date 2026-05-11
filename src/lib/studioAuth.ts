const KEY = "magicorn-studio-auth";
const TTL = 1000 * 60 * 60 * 8; // 8h

export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as string;

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
