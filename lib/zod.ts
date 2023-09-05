import * as z from "zod";
import { maxImageSize, allowedImagesTypes } from "./constants";

// Sign in user
export const signInSchema = z.object({
  email: z.string().email(),
});

// Register or update user data
export const registerOrUpdateUserSchema = z.object({
  name: z.string(),
  username: z.string().min(3),
  image: z
    .custom<File>()
    .refine(
      (file) => file!.size <= maxImageSize,
      `File size should be less than 5 MB.`
    )
    .refine(
      (file) => allowedImagesTypes.includes(file!.type),
      "Only these types are allowed .jpg, .jpeg, .png and .webp"
    )
    .optional(),
});
