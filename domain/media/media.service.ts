import * as mediaRepository from "./media.repository";
import type { UploadedImage } from "./media.types";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export class InvalidImageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidImageError";
  }
}

export async function uploadProductImage(file: File): Promise<UploadedImage> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new InvalidImageError(`Unsupported file type: ${file.type}`);
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new InvalidImageError("File exceeds the 10MB limit");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return mediaRepository.upload(buffer);
}

export async function deleteProductImage(publicId: string): Promise<void> {
  await mediaRepository.remove(publicId);
}
