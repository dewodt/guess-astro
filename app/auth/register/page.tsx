import RegisterForm from "./register-form";
import { authOptions } from "@/lib/auth-options";
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";
import { type Metadata } from "next";
import { getServerSession, type Session } from "next-auth";

export const metadata: Metadata = {
  title: "Register | Guess Astro",
  openGraph: {
    ...openGraphTemplate,
    title: "Register | Guess Astro",
  },
  twitter: {
    ...twitterTemplate,
    title: "Register | Guess Astro",
  },
};

const RegisterPage = async () => {
  // Get session from server (note: already validated in middleware)
  const session = (await getServerSession(authOptions)) as Session;

  return (
    <main className="flex flex-auto items-center justify-center p-6 py-12 sm:p-12 lg:p-24">
      <RegisterForm session={session} />
    </main>
  );
};

export default RegisterPage;
