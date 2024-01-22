"use server";

import { authOptions } from "@/lib/auth-options";
import { uploadImage } from "@/lib/cloudinary";
import { avatarSchema } from "@/lib/zod";
import { getServerSession } from "next-auth";

export const uploadAvatar = async (formData: FormData) => {
  // Get & validate session
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const userId = session.id;
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
