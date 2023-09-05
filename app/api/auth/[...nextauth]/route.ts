import { eq } from "drizzle-orm";
import { db } from "@/lib/drizzle";
import { user as userSchema } from "@/db/schema";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import NextAuth, { type AuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { resend } from "@/lib/resend";
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
    async jwt({ token, user, trigger }) {
      // Everything accept token is null after next refrest after sign in.
      // account -> Email provider: Email specific data; oAuth Provider: oAuth specific data (procider, access token, ect)
      // profile -> oAuth specific data (oAuth user data)
      // user -> User data from database (adapter)

      // Runs when user sign in
      if (user) {
        // Get user username (username is not available in user object)
        const [{ username }] = await db
          .select({ username: userSchema.username })
          .from(userSchema)
          .where(eq(userSchema.id, user.id));

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
        const [{ username, name, image }] = await db
          .select({
            username: userSchema.username,
            name: userSchema.name,
            image: userSchema.image,
          })
          .from(userSchema)
          .where(eq(userSchema.id, user.id));

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
