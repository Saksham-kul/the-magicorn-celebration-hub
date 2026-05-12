// Cloudinary frontend-only helpers (unsigned uploads).
// Admin operations (list/delete) require server-side API secret and are stubbed.

// Cloud name + unsigned upload preset are public values (visible in any browser
// network request to Cloudinary). Hardcoded fallbacks ensure prod builds work
// even when env vars are not provided.
export const CLOUD_NAME =
  (import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string) || "dknec6yor";
export const UPLOAD_PRESET =
  (import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string) || "magicornupload";

export type CloudinaryAsset = {
  public_id: string;
  secure_url: string;
  url: string;
  resource_type: "image" | "video" | "raw";
  format: string;
  width?: number;
  height?: number;
  bytes: number;
  created_at: string;
  original_filename: string;
  folder?: string;
  // Local-only metadata
  display_name?: string;
  starred?: boolean;
};

export const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml", "image/gif", "video/mp4"];
export const ACCEPTED_EXT = ".jpg,.jpeg,.png,.webp,.svg,.gif,.mp4";
export const MAX_BYTES = 50 * 1024 * 1024; // 50MB

export type UploadProgress = (loaded: number, total: number) => void;

export function uploadToCloudinary(
  file: File,
  opts: { folder?: string; onProgress?: UploadProgress } = {}
): Promise<CloudinaryAsset> {
  return new Promise((resolve, reject) => {
    if (!CLOUD_NAME || !UPLOAD_PRESET) {
      reject(new Error("Cloudinary not configured"));
      return;
    }
    const isVideo = file.type.startsWith("video/");
    const resourceType = isVideo ? "video" : "image";
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", UPLOAD_PRESET);
    if (opts.folder) form.append("folder", opts.folder);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && opts.onProgress) opts.onProgress(e.loaded, e.total);
    };
    xhr.onload = () => {
      try {
        const data = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve({
            public_id: data.public_id,
            secure_url: data.secure_url,
            url: data.url,
            resource_type: data.resource_type,
            format: data.format,
            width: data.width,
            height: data.height,
            bytes: data.bytes,
            created_at: data.created_at,
            original_filename: data.original_filename ?? file.name.replace(/\.[^.]+$/, ""),
            folder: opts.folder,
          });
        } else {
          reject(new Error(data?.error?.message || `Upload failed (${xhr.status})`));
        }
      } catch {
        reject(new Error("Invalid Cloudinary response"));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(form);
  });
}

export function buildTransformedUrl(
  publicId: string,
  resourceType: "image" | "video" | "raw",
  format: string,
  transform: string
) {
  const t = transform ? `${transform}/` : "";
  return `https://res.cloudinary.com/${CLOUD_NAME}/${resourceType}/upload/${t}${publicId}.${format}`;
}

export function thumbUrl(asset: CloudinaryAsset, w = 400) {
  if (asset.resource_type === "video") {
    // poster frame
    return `https://res.cloudinary.com/${CLOUD_NAME}/video/upload/w_${w},c_fill,q_auto,f_jpg/${asset.public_id}.jpg`;
  }
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/w_${w},c_fill,q_auto,f_auto/${asset.public_id}.${asset.format}`;
}

export function formatBytes(bytes: number): string {
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

/**
 * Fetch all previously uploaded assets from Cloudinary via the backend API.
 * This provides persistent media access across browser sessions and incognito mode.
 */
export async function fetchCloudinaryAssets(): Promise<CloudinaryAsset[]> {
  try {
    const response = await fetch("/api/listCloudinaryAssets");
    if (!response.ok) {
      console.warn("Failed to fetch Cloudinary assets:", response.status);
      return [];
    }
    const data = await response.json();
    return data.assets || [];
  } catch (error) {
    console.warn("Error fetching Cloudinary assets:", error);
    return [];
  }
}
