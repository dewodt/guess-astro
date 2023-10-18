import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Error 404 | Guess Astro",
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
    <main className="flex flex-auto items-center justify-center p-5 sm:p-10">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="px-9 pt-9">
          <h1 className="text-center text-3xl font-bold text-primary">
            Error 404: Page Not Found
          </h1>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-5 px-9 pb-9">
          <p className="text-center text-lg text-foreground">
            The page you are looking for does&apos;t exists. Click the button
            bellow to go to the home page!
          </p>
          <Link href="/">
            <Button size="lg">Return Home</Button>
          </Link>
        </CardContent>
      </Card>
    </main>
  );
};

export default NotFoundPage;
