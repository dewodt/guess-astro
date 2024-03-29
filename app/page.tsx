import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";
import {
  ArrowRightCircle,
  BarChart3,
  ScrollText,
  Shuffle,
  History,
  Sparkles,
} from "lucide-react";
import { type Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guess Astro",
  openGraph: {
    ...openGraphTemplate,
    title: "Guess Astro",
  },
  twitter: {
    ...twitterTemplate,
    title: "Guess Astro",
  },
};

const Home = () => {
  // Features array
  const features = [
    {
      icon: <Sparkles className="h-8 w-8 stroke-primary" />,
      title: "Various Astronomical Objects",
      description:
        "There are various modes to play with such as constellation and messier mode!",
    },
    {
      icon: <Shuffle className="h-8 w-8 stroke-primary" />,
      title: "Randomized Image Rotation",
      description:
        "The image rotation is randomized so you can't just 'memorize' the image of the object!",
    },
    {
      icon: <ScrollText className="h-8 w-8 stroke-primary" />,
      title: "Leaderboard",
      description:
        "Compete with other players to get the highest score in the leaderboard for different mode!",
    },
    {
      icon: <BarChart3 className="h-8 w-8 stroke-primary" />,
      title: "Statistics",
      description:
        "See your statistics like score, current streak, highest streak, rank, accuracy, activity charts, and more!",
    },
    {
      icon: <History className="h-8 w-8 stroke-primary" />,
      title: "History",
      description:
        "Review your gameplay trajectory effortlessly so that you can analyze the matches you've ever played.",
    },
  ];

  return (
    <main className="flex flex-auto flex-col">
      {/* Hero Section */}
      <section className="flex min-h-[calc(100vh-90px)] w-full items-center justify-center px-6 py-16 sm:p-12 lg:p-24">
        <div className="flex max-w-7xl flex-col-reverse items-center gap-6 sm:flex-row lg:gap-16">
          {/* Hero Texts */}
          <div className="flex flex-col items-start gap-3 lg:gap-6">
            <h1 data-cy="hero-title" className="text-4xl font-bold lg:text-6xl">
              Memorize Astronomical Object Easily.
            </h1>
            <p
              data-cy="hero-description"
              className="text-base font-normal text-muted-foreground lg:text-xl"
            >
              Here at Guess Astro we help you memorize astronomical objects to
              prepare for Astronomy National/International Science Olympiad!
            </p>
            <Link data-cy="hero-link" href="/play">
              <Button tabIndex={-1} size="lg">
                Play Now
                <ArrowRightCircle className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Hero Image */}
          <Image
            src="/orion.svg"
            alt="Image"
            data-cy="hero-image"
            width={400}
            height={400}
            className="w-[200px] lg:w-[420px]"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="flex min-h-[calc(100vh-90px)] w-full items-center justify-center px-6 py-16 sm:p-12 lg:p-24">
        <div className="flex max-w-6xl flex-col gap-7 lg:gap-9">
          <h2
            data-cy="features-title"
            className="text-center text-3xl font-bold lg:text-5xl"
          >
            Epic Features.
          </h2>
          <div
            data-cy="features-list"
            className="flex flex-row flex-wrap justify-center gap-6 lg:gap-8"
          >
            {features.map((feature, index) => (
              <Card
                key={index}
                className="flex w-full flex-row gap-5 p-5 shadow-lg sm:w-[calc(50%-12px)] lg:w-[calc(50%-16px)]"
              >
                <CardContent className="flex items-center p-0">
                  {feature.icon}
                </CardContent>
                <CardHeader className="justify-center p-0">
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
