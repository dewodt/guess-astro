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
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Username can only contain alphanumeric characters"
    ),
  image: z
    .custom<File | "DELETE">()
    .refine((file) => {
      if (file === "DELETE") return true;

      return file!.size <= maxImageSize;
    }, `File size should be less than 5 MB`)
    .refine((file) => {
      if (file === "DELETE") return true;

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

// Search Params Schema for data-table
// Validation to prevent SQL injection
export const dataTableSearchParamsSchema = z.object({
  page: z.coerce.number().min(1).default(1),
  per_page: z.coerce.number().min(1).default(10),
  sort: z
    .string()
    .optional()
    .refine((str) => {
      // If sort is empty (optional case)
      if (!str) return true;

      // Split sort (note only 1 column can be sorted at a time)
      const splitted = str.split(".") as string[];
      if (splitted.length !== 2) return false;
      const [column, order] = splitted;

      // Check if column is valid
      // Sortable column only includes "createdAt"
      return column === "createdAt" && (order === "asc" || order === "desc");
    }),
  operator: z.enum(["and", "or"]).optional(),
  result: z
    .string()
    .optional()
    .refine((str) => {
      // If result is empty (optional case)
      if (!str) return true;

      const results = str.split(".") as string[];
      if (results.length > 2) return false;

      return results.every((result) => result === "win" || result === "lose");
    }),
  createdAt: z
    .string()
    .optional()
    .refine((str) => {
      // If createdAt is empty (optional case)
      if (!str) return true;

      // Split from and to
      const splitted = str.split(".");
      if (splitted.length !== 2) return false;
      const [from, to] = splitted;

      // Check if from & to are valid dates
      const zodDateSchema = z.string().datetime({ precision: 0 });
      const fromValid = zodDateSchema.safeParse(from);
      const toValid = zodDateSchema.safeParse(to);

      return fromValid.success && toValid.success;
    }),
});
