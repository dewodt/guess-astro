import { type Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <main className="flex flex-auto flex-col items-center justify-center gap-10 p-5 sm:p-12 lg:gap-16 lg:p-16">
      {/* Mission */}
      <section className="max-w-2xl">
        <Card className="flex flex-col gap-2 p-8 shadow-lg lg:gap-5 lg:p-10">
          <CardHeader className="p-0">
            <CardTitle className="text-center text-2xl font-bold lg:text-4xl">
              Mission
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-justify text-lg lg:text-xl">
              Help students memorize astronomical objects to prepare for
              astronomy national/international science olympiad.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* Contact Me */}
      <section className="max-w-2xl">
        <Card className="flex flex-col gap-2 p-8 shadow-lg lg:gap-5 lg:p-10">
          <CardHeader className="p-0">
            <CardTitle className="text-center text-2xl font-bold lg:text-4xl">
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-justify text-lg lg:text-xl">
              This app is{" "}
              <Link
                href="https://github.com/dewodt/guess-astro"
                target="_blank"
              >
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
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default AboutPage;
