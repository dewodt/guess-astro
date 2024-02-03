import { type UploadApiOptions, v2 as cloudinary } from "cloudinary";
import "server-only";

interface UploadImageProps {
  folderName: string;
  fileName: string;
  file: Blob;
}

// Upload avatar image
export const uploadImage = async ({
  file,
  folderName,
  fileName,
}: UploadImageProps): Promise<string | null> => {
  // Cloudinary Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  // Options
  const options: UploadApiOptions = {
    folder: folderName,
    public_id: fileName,
    overwrite: true,
  };

  // Cloudinary accepts base64 url
  // Convert blob to base64
  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;

  // Upload image
  try {
    const result = await cloudinary.uploader.upload(base64, options);
    // Success (secure_url uses https)
    return result.secure_url;
  } catch (error) {
    // Error
    return null;
  }
};
