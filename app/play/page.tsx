import Link from "next/link";
import { Metadata } from "next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Play | Guess Astro",
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
    title: "Play | Guess Astro",
    description:
      "Guess Astro is a website to help students memorizing astronomical objects for astronomy national science olympiad.",
    url: "https://astro.dewodt.com/",
    siteName: "Guess Astro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Play | Guess Astro",
    description:
      "Guess Astro is a website to help students memorizing astronomical objects for astronomy national science olympiad.",
  },
};

const PlayMenuPage = () => {
  const modes = [
    {
      title: "Constellation",
      description: "Memorize the name of the constellations and their shape",
      iconUrl: "/orion.svg",
      iconAlt: "Constellation Icon",
      playUrl: "/play/constellation",
    },
    {
      title: "Messier",
      description: "Memorize the name of the messier objects",
      iconUrl: "/galaxy.svg",
      iconAlt: "Galaxy Icon",
      playUrl: "/play/messier",
    },
  ];

  return (
    <main className="flex flex-auto  items-center justify-center p-5 py-10 sm:p-12">
      <section className="flex max-w-5xl flex-col gap-6 lg:gap-8">
        <div className="flex flex-col gap-3 lg:gap-4">
          <h1 className="text-center text-3xl font-bold lg:text-5xl">
            Choose Gamemode!
          </h1>
          <p className="text-center text-base text-muted-foreground lg:text-xl">
            You can choose between multiple gamemode to memorize different
            astronomical objects.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {modes.map((mode, index) => {
            return (
              <Link key={index} href={mode.playUrl}>
                <Card className="flex flex-row gap-5 p-5 shadow-lg">
                  <CardContent className="p-0">
                    <Image
                      src={mode.iconUrl}
                      alt={mode.iconAlt}
                      width={96}
                      height={96}
                      className="h-20 w-20"
                    />
                  </CardContent>
                  <CardHeader className="justify-center p-0">
                    <CardTitle>{mode.title}</CardTitle>
                    <CardDescription>{mode.description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
};

export default PlayMenuPage;
