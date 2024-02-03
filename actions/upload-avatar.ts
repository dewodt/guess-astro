"use server";

import { authOptions } from "@/lib/auth-options";
import { uploadImage } from "@/lib/cloudinary";
import { avatarSchema } from "@/lib/zod";
import { getServerSession } from "next-auth";

export const uploadAvatar = async (formData: FormData) => {
  // Get & validate session
  const session = await getServerSession(authOptions);
  if (!session) return null;

  // Validate file
  const rawFile = formData.get("file");
  const zodResult = avatarSchema.safeParse(rawFile);
  if (!zodResult.success) return null;

  // File data
  const file = zodResult.data;
  const folderName = "guess-astro/user";
  const fileName = session.id;

  // Upload image
  const imageUrl = await uploadImage({ file, folderName, fileName });

  return imageUrl;
};
