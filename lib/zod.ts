import {
  maxImageSize,
  allowedImagesTypes,
  modes,
  allowedImageHosts,
} from "./constants";
import * as z from "zod";

// Sign in user
export const signInSchema = z.object({
  email: z.string({ required_error: "Email is required" }).email(),
});

// Register or update user data
export const registerOrUpdateUserSchema = z.object({
  name: z.string({ required_error: "Name is required" }),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be at most 30 characters")
    .regex(
      /^[A-Za-z0-9]+$/,
      "Username can only contain alphanumeric characters"
    ),
  image: z
    .string()
    .url("Invalid url")
    .refine(
      (str) => allowedImageHosts.some((host) => str.startsWith(host)),
      "Invalid host url"
    )
    .nullable(),
});

// Avatar Schema
export const avatarSchema = z
  .custom<File>()
  .refine((file) => {
    return file.size <= maxImageSize;
  }, `File size should be less than 5 MB`)
  .refine((file) => {
    return allowedImagesTypes.includes(file.type);
  }, "Only these types are allowed .jpg, .jpeg, .png and .webp");

// MatchAnswerSchema
export const MatchAnswerSchema = z.object({
  id: z.string({ required_error: "ID is required" }),
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

      return results.every(
        (result) => result === "correct" || result === "incorrect"
      );
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
