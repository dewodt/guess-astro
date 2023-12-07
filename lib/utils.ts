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

  // Get attributes errors
  const errors = zodParseResult.error.errors;
  errors.forEach((error, index) => {
    // Add path to message
    description += `${error.path}`;

    // Add comma if not last and period if last
    if (index !== errors.length - 1) {
      description += ", ";
    } else {
      description += ".";
    }
  });

  return description;
};
