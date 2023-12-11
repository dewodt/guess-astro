import "server-only";

import { eq } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { user as userSchema } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { resend } from "@/lib/resend";
import SignInEmail from "@/emails/sign-in";
import WelcomeEmail from "@/emails/welcome";

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
            subject: "Verify Request to Guess Astro",
            react: SignInEmail({ url: url }),
          });
        } catch (error) {
          console.log({ error });
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          prompt: "select_account",
          scope:
            "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        },
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID as string,
      clientSecret: process.env.DISCORD_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "email identify",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Everything accept token is null after next refrest after sign in.
      // account -> Email provider: Email specific data; oAuth Provider: oAuth specific data (procider, access token, ect)
      // profile -> oAuth specific data (oAuth user data)
      // user -> User data from database (adapter)

      // Runs when user sign in
      if (user) {
        // Get user username (username is not available in user object)
        const { username } = (await db.query.user.findFirst({
          columns: { username: true },
          where: eq(userSchema.id, user.id),
        }))!;

        // Update token
        token.id = user.id;
        token.email = user.email as string;
        token.username = username ?? null;
        token.name = user.name ?? null;
        token.image = user.image ?? null;
      }

      // Trigger update session (when user changes username / fullname / avatar image)
      if (trigger === "update") {
        // Get new data
        const { username, name, image } = (await db.query.user.findFirst({
          columns: { username: true, name: true, image: true },
          where: eq(userSchema.id, token.id),
        }))!;

        // Update token
        token.username = username;
        token.name = name;
        token.image = image ?? null;
      }

      return token;
    },
    async session({ session, token }) {
      session.id = token.id;
      session.email = token.email;
      session.username = token.username;
      session.name = token.name;
      session.image = token.image;

      return session;
    },
  },
  events: {
    async signIn({ isNewUser, user }) {
      // Send welcome email
      if (isNewUser && user.email) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM as string,
            to: user.email,
            subject: "Welcome to Guess Astro",
            react: WelcomeEmail(),
          });
        } catch (error) {
          console.log({ error });
        }
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
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
