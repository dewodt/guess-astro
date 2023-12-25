import { createHash } from "crypto";
import "server-only";

// Upload avatar image
export const uploadImage = async (
  folderName: string,
  fileName: string,
  file: Blob
) => {
  const cloudinaryEndPoint = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const timestamp = Math.floor(Date.now() / 1000);

  const hash = createHash("sha1");
  const str = `folder=${folderName}&public_id=${fileName}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  hash.update(str);
  const signature = hash.digest("hex");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", process.env.CLOUDINARY_API_KEY as string);
  formData.append("signature", signature);
  formData.append("folder", folderName);
  formData.append("public_id", fileName);
  formData.append("timestamp", timestamp + "");

  const res = await fetch(cloudinaryEndPoint, {
    method: "POST",
    body: formData,
  });

  // Fail upload
  if (!res.ok) return null;

  // Success upload
  const resJSON = await res.json();
  const imageUrl = resJSON.secure_url as string;

  return imageUrl;
};

// Delete avatar image
// export const deleteImage = async (publicId: string): Promise<void> => {
//   const cloudinaryEndPoint = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/destroy`;
//   const timestamp = Math.floor(Date.now() / 1000);

//   const hash = createHash("sha1");
//   const str = `public_id=${publicId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
//   hash.update(str);
//   const signature = hash.digest("hex");

//   const formData = new FormData();
//   formData.append("api_key", process.env.CLOUDINARY_API_KEY as string);
//   formData.append("signature", signature);
//   formData.append("public_id", publicId);
//   formData.append("timestamp", timestamp + "");

//   await fetch(cloudinaryEndPoint, {
//     method: "POST",
//     body: formData,
//   });
// };
