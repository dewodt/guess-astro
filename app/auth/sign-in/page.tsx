import SignInForm from "./sign-in-form";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Guess Astro",
  description:
    "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  metadataBase: new URL("https://astro.dewodt.com"),
  generator: "Next.js",
  applicationName: "Guess Astro",
  keywords: ["Guess Astro", "Astronomy", "Game"],
  category: "education",
  openGraph: {
    title: "Sign In | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    url: "https://astro.dewodt.com/",
    siteName: "Guess Astro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  },
};

const SignInPage = async () => {
  return (
    <main className="flex flex-auto items-center justify-center p-6 py-12 sm:p-12 lg:p-24">
      <Card className="w-full max-w-sm shadow-lg">
        {/* Title */}
        <CardHeader>
          <h1
            data-cy="sign-in-title"
            className="text-center text-3xl font-bold text-primary"
          >
            Sign In
          </h1>
        </CardHeader>

        {/* Sign in Form & with Google Option */}
        <CardContent>
          <SignInForm />
        </CardContent>
      </Card>
    </main>
  );
};

export default SignInPage;
