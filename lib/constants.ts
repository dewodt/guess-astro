// Image Constants
export const maxImageSize = 5242880; // 5 MB
export const allowedImagesTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

// Game modes
export const modes = ["constellation", "messier"] as const;

// Match result enum
export const matchResults = ["win", "lose"] as const;
