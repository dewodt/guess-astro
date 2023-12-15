import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { SafeParseError } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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

// Convert month to string (0 -> Jan, 1 -> Feb, ect)
export const getShortMonth = (month: number) => {
  const date = new Date();
  date.setMonth(month);
  return date.toLocaleString("en-US", { month: "short" });
};

export const getZodParseErrorPaths = <T>(zodParseResult: SafeParseError<T>) => {
  // Get each path of error and add them to an array (unique)
  const errors = zodParseResult.error.errors.map((error) => {
    return {
      path: error.path[0] as string,
      description: error.message,
    };
  });

  return errors;
};

export const getZodParseErrorDescription = <T>(
  zodParseResult: SafeParseError<T>
) => {
  // Initiate message
  let description = "An error occured in the following fields: ";

  // Get unique attributes errors
  const errors = new Set(
    zodParseResult.error.errors.map((error) => error.path[0])
  );

  errors.forEach((error, index) => {
    // Add path to message
    description += `${error}`;

    // Add comma if not last and period if last
    if (index !== errors.size - 1) {
      description += ", ";
    } else {
      description += ".";
    }
  });

  return description;
};
