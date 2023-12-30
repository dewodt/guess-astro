import ProfileForm from "./profile-form";
import { authOptions } from "@/lib/auth-options";
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";
import { type Metadata } from "next";
import { getServerSession, type Session } from "next-auth";

export const metadata: Metadata = {
  title: "Profile | Guess Astro",
  openGraph: {
    ...openGraphTemplate,
    title: "Profile | Guess Astro",
  },
  twitter: {
    ...twitterTemplate,
    title: "Profile | Guess Astro",
  },
};

const ProfilePage = async () => {
  // Get session from server (note: already validated in middleware)
  const session = (await getServerSession(authOptions)) as Session;

  return (
    <main className="w-full">
      <ProfileForm session={session} />
    </main>
  );
};

export default ProfilePage;
