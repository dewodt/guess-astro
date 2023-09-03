import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import NextAuth, { type AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { resend } from "@/emails";
import SignInTemplate from "@/emails/sign-in-template";

export const authOptions: AuthOptions = {
  adapter: DrizzleAdapter(db),
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      async sendVerificationRequest({ identifier, url, provider }) {
        try {
          await resend.emails.send({
            from: provider.from,
            to: identifier,
            subject: "Sign in to Guess Astro",
            react: SignInTemplate({ url: url }),
          });
        } catch (error) {
          console.log({ error });
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async session({ session, token }) {
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 86400, // Time since **IDLE**
  },
  pages: {
    signIn: "/sign-in",
    verifyRequest: "/verify-request",
    newUser: "/register",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
