import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Guess Astro",
  openGraph: {
    ...openGraphTemplate,
    title: "About | Guess Astro",
  },
  twitter: {
    ...twitterTemplate,
    title: "About | Guess Astro",
  },
};

const AboutPage = () => {
  return (
    <main className="flex flex-auto flex-col items-center justify-center gap-10 p-6 py-12 sm:p-12 lg:gap-16 lg:p-24">
      {/* Mission */}
      <section className="max-w-2xl">
        <Card className="flex flex-col gap-2 p-8 shadow-lg lg:gap-5 lg:p-10">
          <CardHeader className="p-0">
            <h1
              data-cy="mission-title"
              className="text-center text-2xl font-bold leading-none tracking-tight lg:text-4xl lg:leading-none"
            >
              Mission
            </h1>
          </CardHeader>
          <CardContent className="p-0">
            <p
              data-cy="mission-description"
              className="text-justify text-base lg:text-xl"
            >
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
            <h1
              data-cy="contact-title"
              className="text-center text-2xl font-bold leading-none tracking-tight lg:text-4xl lg:leading-none"
            >
              Contact
            </h1>
          </CardHeader>
          <CardContent className="p-0">
            <p
              data-cy="contact-description"
              className="text-justify text-base lg:text-xl"
            >
              This app is{" "}
              <Link
                data-cy="contact-repo"
                href="https://github.com/dewodt/guess-astro"
                target="_blank"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                open source
              </Link>
              . If you have any feedback, suggestion, inquiries, or anything you
              want to tell me, please feel free to contact me at{" "}
              <Link
                data-cy="contact-email"
                href="mailto:dewantorotriatmojo@gmail.com"
                target="_blank"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                this email.
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default AboutPage;
