import Link from "next/link";
import { type Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Authentication Error | Guess Astro",
  description:
    "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  metadataBase: new URL("https://astro.dewodt.com"),
  generator: "Next.js",
  applicationName: "Guess Astro",
  keywords: ["Guess Astro", "Astronomy", "Game"],
  category: "education",
  openGraph: {
    title: "Authentication Error | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    url: "https://astro.dewodt.com/",
    siteName: "Guess Astro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Authentication Error | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  },
};

const AuthErrorPage = () => {
  return (
    <main className="flex flex-auto items-center justify-center p-6 py-12 sm:p-12 lg:p-24">
      <section className="max-w-xl">
        <Card className="flex flex-col gap-2 p-8 shadow-lg lg:gap-5 lg:p-10">
          <CardHeader className="p-0">
            <h1 className="text-center text-2xl font-bold leading-none tracking-tight lg:text-4xl lg:leading-none">
              Authentication Error
            </h1>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-5 p-0">
            <p className="text-center text-base lg:text-xl">
              We ran into an issue while signing you in, please take a break and
              try again soon.
            </p>
            <Link href="/auth/sign-in">
              <Button size="lg">Try Again</Button>
            </Link>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default AuthErrorPage;