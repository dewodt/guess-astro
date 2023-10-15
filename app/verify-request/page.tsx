import { type Metadata } from "next";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Verify Request | Guess Astro",
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
    title: "Verify Request | Guess Astro",
    description:
      "Guess Astro is a website to help students memorizing astronomical objects for astronomy national science olympiad.",
    url: "https://astro.dewodt.com/",
    siteName: "Guess Astro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Verify Request | Guess Astro",
    description:
      "Guess Astro is a website to help students memorizing astronomical objects for astronomy national science olympiad.",
  },
};

const VerifyRequest = () => {
  return (
    <main className="flex flex-auto items-center justify-center p-5 sm:p-10">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader>
          <h1 className="text-center text-3xl font-bold text-primary">
            Verify Request
          </h1>
        </CardHeader>
        <CardContent>
          <p className="text-justify text-base">
            To complete the verification process, please check your email inbox
            for a verification link from us. If you don&apos;t see the email in
            your inbox, please also check your spam folder.
          </p>
        </CardContent>
      </Card>
    </main>
  );
};

export default VerifyRequest;
