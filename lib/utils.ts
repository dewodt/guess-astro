import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export const getBaseUrl = () => {
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
};
