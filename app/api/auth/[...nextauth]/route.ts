import { authOptions } from "@/lib/auth-options";
import NextAuth from "next-auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username: string | null; // Username is null when first time sign in
    name: string | null; // When using email provider, email is null in first time sign in
    image: string | null; // When using email provider, image is null in first time sign in
  }
}

declare module "next-auth" {
  interface Session {
    id: string;
    email: string;
    username: string | null; // Username is null when first time sign in
    name: string | null; // When using email provider, email is null in first time sign in
    image: string | null; // When using email provider, image is null in first time sign in
  }
}
