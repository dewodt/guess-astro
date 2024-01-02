import { type JWT } from "next-auth/jwt/types";

export const testUserJwtMock: JWT = {
  id: "74607127-c007-4a95-bb74-857e931a205f",
  sub: "74607127-c007-4a95-bb74-857e931a205f",
  username: "testuser",
  name: "Test User",
  email: "testuserdewodt@gmail.com",
  image:
    "https://lh3.googleusercontent.com/a/ACg8ocJ70HlfjYNMiVhMcL39qTKVmQBMBUpjmsEHWWq5qCrL=s288-c-no",
  picture:
    "https://lh3.googleusercontent.com/a/ACg8ocJ70HlfjYNMiVhMcL39qTKVmQBMBUpjmsEHWWq5qCrL=s288-c-no",
};

export const unregisteredUserJwtMock: JWT = {
  id: "unregistered-user",
  sub: "unregistered-user",
  username: null,
  name: null,
  email: "unregistereduser@gmail.com",
  image: null,
  picture: null,
};
