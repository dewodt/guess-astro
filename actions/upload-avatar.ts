"use server";

import { uploadImage } from "@/lib/cloudinary";
import { avatarSchema } from "@/lib/zod";

export const uploadAvatar = async (formData: FormData) => {
  // userId is passed from session.id and session is already validated in middleware
  const userId = formData.get("userId") as string;
  const file = formData.get("file") as Blob;

  // Validate file
  const zodResult = avatarSchema.safeParse(file);
  if (!zodResult.success) return null;

  // Folder name
  const folderName = "guess-astro/user";

  // Delete image
  // fileName = userId
  const imageUrl = await uploadImage(folderName, userId, file);

  return imageUrl;
};
