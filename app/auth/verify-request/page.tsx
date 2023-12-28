import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Request | Guess Astro",
  description:
    "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  metadataBase: new URL("https://astro.dewodt.com"),
  generator: "Next.js",
  applicationName: "Guess Astro",
  keywords: ["Guess Astro", "Astronomy", "Game"],
  category: "education",
  openGraph: {
    title: "Verify Request | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    url: "https://astro.dewodt.com/",
    siteName: "Guess Astro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verify Request | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  },
};

const VerifyRequest = () => {
  return (
    <main className="flex flex-auto items-center justify-center p-6 py-12 sm:p-12 lg:p-24">
      <section className="max-w-xl">
        <Card className="flex flex-col gap-2 p-8 shadow-lg lg:gap-5 lg:p-10">
          <CardHeader className="p-0">
            <h1
              data-cy="verify-request-title"
              className="text-center text-2xl font-bold leading-none tracking-tight lg:text-4xl lg:leading-none"
            >
              Verify Request
            </h1>
          </CardHeader>
          <CardContent className="p-0">
            <p
              data-cy="verify-request-description"
              className="text-justify text-base lg:text-xl"
            >
              To complete the verification process, please check your email
              inbox for a verification link from us. If you don&apos;t see the
              email in your inbox, please also check your spam folder.
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
};

export default VerifyRequest;
