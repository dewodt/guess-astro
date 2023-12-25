import ProfileForm from "./profile-form";
import { authOptions } from "@/lib/auth-options";
import { type Metadata } from "next";
import { getServerSession, type Session } from "next-auth";

export const metadata: Metadata = {
  title: "Profile | Guess Astro",
  description:
    "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  metadataBase: new URL("https://astro.dewodt.com"),
  generator: "Next.js",
  applicationName: "Guess Astro",
  keywords: ["Guess Astro", "Astronomy", "Game"],
  category: "education",
  openGraph: {
    title: "Profile | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    url: "https://astro.dewodt.com/",
    siteName: "Guess Astro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
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
