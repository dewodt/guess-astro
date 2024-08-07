import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Play | Guess Astro",
  openGraph: {
    ...openGraphTemplate,
    title: "Play | Guess Astro",
  },
  twitter: {
    ...twitterTemplate,
    title: "Play | Guess Astro",
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
    <main className="flex flex-auto  items-center justify-center p-6 py-12 sm:p-12 lg:p-24">
      <section className="flex max-w-5xl flex-col gap-6 lg:gap-8">
        <div className="flex flex-col gap-3 lg:gap-4">
          <h1
            data-cy="play-title"
            className="text-center text-3xl font-bold lg:text-5xl"
          >
            Choose Gamemode!
          </h1>
          <p
            data-cy="play-description"
            className="text-center text-base text-muted-foreground lg:text-xl"
          >
            You can choose between multiple gamemode to memorize different
            astronomical objects.
          </p>
        </div>
        <div
          data-cy="play-options"
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8"
        >
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
