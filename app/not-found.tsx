import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Error 404 | Guess Astro",
  description:
    "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  metadataBase: new URL("https://astro.dewodt.com"),
  generator: "Next.js",
  applicationName: "Guess Astro",
  keywords: ["Guess Astro", "Astronomy", "Game"],
  category: "education",
  openGraph: {
    title: "Error 404 | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    url: "https://astro.dewodt.com/",
    siteName: "Guess Astro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Error 404 | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  },
};

const NotFoundPage = () => {
  return (
    <main className="flex flex-auto items-center justify-center p-6 py-12 sm:p-12 lg:p-24">
      <section className="max-w-xl">
        <Card className="flex flex-col gap-2 p-8 shadow-lg lg:gap-5 lg:p-10">
          <CardHeader className="p-0">
            <h1 className="text-center text-2xl font-bold leading-none tracking-tight lg:text-4xl lg:leading-none">
              Error 404: Page Not Found
            </h1>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 p-0">
            <p className="text-center text-base lg:text-xl">
              The page you are looking for doesn&apos;t exists. Click the button
              bellow to go to the home page!
            </p>
            <Link href="/">
              <Button size="lg">Return Home</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default NotFoundPage;
