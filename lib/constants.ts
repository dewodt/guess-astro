// Image Constants
export const maxImageSize = 5242880; // 5 MB
export const allowedImagesTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];
export const allowedImageHosts = [
  "https://res.cloudinary.com/",
  "https://lh3.googleusercontent.com/",
  "https://cdn.discordapp.com/",
];

// Game modes
export const modes = ["constellation", "messier"] as const;

// Match result enum
export const matchResults = ["correct", "incorrect"] as const;
