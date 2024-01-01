import { type User } from "../../db/schema";

// User data seed
export const userSeed: User[] = [
  // Main character used for testing, unregistered user
  {
    id: "74607127-c007-4a95-bb74-857e931a205f",
    email: "testuserdewodt@gmail.com",
    emailVerified: null,
    username: "testuser",
    name: "Test User",
    image:
      "https://lh3.googleusercontent.com/a/ACg8ocJ70HlfjYNMiVhMcL39qTKVmQBMBUpjmsEHWWq5qCrL=s96-c",
    createdAt: new Date(2023, 10, 1),
  },
  // One unregister user
  {
    id: "unregistered-user",
    email: "unregistereduser@gmail.com",
    emailVerified: null,
    username: null,
    name: null,
    image: null,
    createdAt: new Date(2023, 10, 1),
  },
  // Test users, registered users
  ...Array.from({ length: 15 }, (_, i) => i).map((i) => {
    return {
      id: `user-${i + 1}`,
      email: `user${i + 1}@gmail.com`,
      emailVerified: null,
      username: `user${i + 1}`,
      name: `User ${i + 1}`,
      image: null,
      createdAt: new Date(2023, 10, i + 1),
    };
  }),
];
