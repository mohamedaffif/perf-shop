import type { ImageLoaderProps } from "next/image";

const UPLOAD_SEGMENT = "/image/upload/";

/**
 * next/image loader that hands resizing to Cloudinary's CDN instead of the
 * Next.js image optimizer, so sharp never burns app-server CPU. Inserts a
 * transformation right after `/image/upload/` in the stored secure_url:
 * f_auto (AVIF/WebP per browser), q_auto (or the requested quality),
 * w_<width> with c_limit (never upscale past the original).
 *
 * Runs in the browser too — keep it free of server-only imports (not the
 * `cloudinary` SDK from lib/cloudinary.ts).
 */
export default function cloudinaryLoader({ src, width, quality }: ImageLoaderProps): string {
  const index = src.indexOf(UPLOAD_SEGMENT);
  if (!src.startsWith("https://res.cloudinary.com/") || index === -1) {
    return src;
  }

  const transformation = ["f_auto", `q_${quality ?? "auto"}`, `w_${width}`, "c_limit"].join(",");
  const splitAt = index + UPLOAD_SEGMENT.length;

  return `${src.slice(0, splitAt)}${transformation}/${src.slice(splitAt)}`;
}
