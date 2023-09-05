import { createHash } from "crypto";

export const uploadAvatar = async (
  userId: string,
  image: Blob
): Promise<string> => {
  const cloudinaryEndPoint = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;
  const timestamp = Math.floor(Date.now() / 1000);

  const hash = createHash("sha1");
  const str = `folder=guess-astro/user&public_id=${userId}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  hash.update(str);
  const signature = hash.digest("hex");

  const formData = new FormData();
  formData.append("file", image);
  formData.append("api_key", process.env.CLOUDINARY_API_KEY as string);
  formData.append("signature", signature);
  formData.append("folder", "guess-astro/user");
  formData.append("public_id", userId);
  formData.append("timestamp", timestamp + "");

  const res = await fetch(cloudinaryEndPoint, {
    method: "POST",
    body: formData,
  });

  const resJSON = await res.json();

  return resJSON.secure_url;
};
