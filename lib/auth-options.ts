import PostHogClient from "./posthog-server";
import { user as userSchema } from "@/db/schema";
import SignInEmail from "@/emails/sign-in";
import WelcomeEmail from "@/emails/welcome";
import { db } from "@/lib/drizzle";
import { resend } from "@/lib/resend";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import { type AuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import "server-only";

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
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "user:email",
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
    async signIn({ isNewUser, user, account }) {
      // Initialize posthog client
      const posthogClient = PostHogClient();

      // If user is new
      if (isNewUser && user.email) {
        // Send welcome email
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

        // Send sign up event to PostHog
        posthogClient.capture({
          distinctId: user.id,
          event: "user signed up",
          properties: {
            provider: account?.provider,
          },
        });
      }

      // Send sign in event to posthog
      posthogClient.capture({
        distinctId: user.id,
        event: "user signed in",
        properties: {
          provider: account?.provider,
        },
      });
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 86400, // Time since **IDLE**
  },
  pages: {
    signIn: "/auth/sign-in",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/register",
    signOut: "/auth/sign-out",
    error: "/auth/error",
  },
};
