import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About | Guess Astro",
  description:
    "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  metadataBase: new URL("https://astro.dewodt.com"),
  generator: "Next.js",
  applicationName: "Guess Astro",
  keywords: ["Guess Astro", "Astronomy", "Game"],
  colorScheme: "normal",
  category: "education",
  themeColor: "#2563EB",
  openGraph: {
    title: "About | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    url: "https://astro.dewodt.com/",
    siteName: "Guess Astro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  },
};

const AboutPage = () => {
  return (
    <main className="flex flex-auto flex-col items-center justify-center gap-16 p-5 sm:p-12 lg:gap-28 lg:p-16">
      {/* Mission */}
      <section className="flex max-w-3xl flex-col gap-2 text-center lg:gap-5">
        <h1 className="text-3xl font-bold lg:text-5xl">Mission</h1>
        <p className="text-lg text-black lg:text-xl">
          Help students memorize astronomical objects to prepare for astronomy
          national/international science olympiad.
        </p>
      </section>

      {/* Contact Me */}
      <section className="flex max-w-3xl flex-col gap-2 text-center lg:gap-5">
        <h1 className="text-3xl font-bold lg:text-5xl">Contact</h1>
        <p className="text-lg text-black lg:text-xl">
          This app is{" "}
          <Link href="https://github.com/dewodt/guess-astro" target="_blank">
            <Button variant="link" className="h-fit p-0 text-lg lg:text-xl">
              open source
            </Button>
          </Link>
          . If you have any feedback, suggestion, inquiries, or anything you
          want to tell me, please feel free to contact me at{" "}
          <Link href="mailto:dewantorotriatmojo@gmail.com" target="_blank">
            <Button variant="link" className="h-fit p-0 text-lg lg:text-xl">
              this email.
            </Button>
          </Link>
        </p>
      </section>
    </main>
  );
};

export default AboutPage;
