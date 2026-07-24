import { cloudinary } from "@/lib/cloudinary";
import type { UploadedImage } from "./media.types";

const PRODUCT_IMAGE_FOLDER = "de-perfume-shop/products";

export function upload(buffer: Buffer): Promise<UploadedImage> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: PRODUCT_IMAGE_FOLDER },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    stream.end(buffer);
  });
}

export async function remove(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}
