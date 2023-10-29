import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SafeParseError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const objectToFormData = (obj: Object) => {
  const formData = new FormData();

  Object.entries(obj).forEach(([key, value]) => {
    value !== undefined && formData.append(key, value);
  });

  return formData;
};

export const formDataToObject = (formData: FormData) => {
  return Object.fromEntries(formData);
};

export const getTitleCase = (str: string): string => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getFormattedDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

export const getZodParseErrorMessage = <T>(
  zodParseResult: SafeParseError<T>
): string => {
  // Convert zod error to string
  const ArrayOfErrorMessages = zodParseResult.error.errors.map(
    (error) => `${error.path.join(", ")}: ${error.message}`
  );
  const errorMessage = ArrayOfErrorMessages.join("\n");

  return errorMessage;
};
