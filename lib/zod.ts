import * as z from "zod";
import { maxImageSize, allowedImagesTypes, modes } from "./constants";

// Sign in user
export const signInSchema = z.object({
  email: z.string().email(),
});

// Register or update user data
// Image states:
// 1. File: User uploaded a new image
// 2. "DELETE": User deleted the image
// 3. undefined: User didn't upload a new image
export const registerOrUpdateUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  image: z
    .custom<File | "DELETE">()
    .refine((file) => {
      if (file === "DELETE") {
        return true;
      }
      return file!.size <= maxImageSize;
    }, `File size should be less than 5 MB`)
    .refine((file) => {
      if (file === "DELETE") {
        return true;
      }
      return allowedImagesTypes.includes(file!.type);
    }, "Only these types are allowed .jpg, .jpeg, .png and .webp")
    .nullable(),
});

// MatchAnswerSchema
export const MatchAnswerSchema = z.object({
  id: z.string(),
  mode: z.enum(modes),
  answer: z.string({
    required_error: "Please select an answer",
  }),
});
