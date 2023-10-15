import { type Metadata } from "next";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import ProfileForm from "./profile-form";
import { User } from "lucide-react";

export const metadata: Metadata = {
  title: "Profile | Guess Astro",
  description:
    "Guess Astro is a website to help students memorizing astronomical objects for astronomy national science olympiad.",
  metadataBase: new URL("https://astro.dewodt.com"),
  generator: "Next.js",
  applicationName: "Guess Astro",
  keywords: ["Guess Astro", "Astronomy", "Game"],
  colorScheme: "normal",
  category: "education",
  themeColor: "#2563EB",
  openGraph: {
    title: "Profile | Guess Astro",
    description:
      "Guess Astro is a website to help students memorizing astronomical objects for astronomy national science olympiad.",
    url: "https://astro.dewodt.com/",
    siteName: "Guess Astro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Profile | Guess Astro",
    description:
      "Guess Astro is a website to help students memorizing astronomical objects for astronomy national science olympiad.",
  },
};

const ProfilePage = () => {
  return (
    <main className="w-full">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex flex-row items-center gap-2">
            <User className="h-6 w-6 stroke-primary" />
            <h2 className="text-2xl font-bold text-primary">Profile</h2>
          </div>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default ProfilePage;
