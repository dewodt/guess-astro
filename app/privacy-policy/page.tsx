import { Button } from "@/components/ui/button";
import { type Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Guess Astro",
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
    title: "Privacy Policy | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    url: "https://astro.dewodt.com/",
    siteName: "Guess Astro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Guess Astro",
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  },
};

const PrivacyPolicyPage = () => {
  return (
    <main className="flex flex-auto justify-center px-6 py-12 sm:p-14 lg:p-20">
      <section className="flex max-w-4xl flex-col gap-5 lg:gap-10">
        <div className="flex flex-col gap-2 lg:gap-6">
          <h1 className="text-center text-3xl font-bold lg:text-5xl">
            Privacy Policy
          </h1>
          <p className="text-justify text-base lg:text-lg">
            Welcome to Guess Astro! At Guess Astro, we are committed to
            protecting your privacy and ensuring the security of your personal
            information. This Privacy Policy outlines how we collect, use, and
            safeguard the information you provide to us while using our
            services. By accessing and using our website or mobile application,
            you consent to the practices described in this Privacy Policy.
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:gap-4">
          <h2 className="text-xl font-bold lg:text-3xl">
            Information We Collect
          </h2>
          <p className="text-justify text-base lg:text-lg">
            To run this app, we collect several user information such as email
            address, name, username, and an optional profile picture data. We
            may also collect data on your interactions with the website such as
            game activity and usage patterns.
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:gap-4">
          <h2 className="text-xl font-bold lg:text-3xl">
            How We Use Your Information
          </h2>
          <p className="text-justify text-base lg:text-lg">
            We collect user information to manage user/player account in our
            application. We also collect your game/match activity to keep track
            of your statistics and progress.
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:gap-4">
          <h2 className="text-xl font-bold lg:text-3xl">Data Security</h2>
          <p className="text-justify text-base lg:text-lg">
            We are committed to ensuring the security of your personal
            information. We implement reasonable technical and organizational
            measures to protect your data from unauthorized access, disclosure,
            alteration, and destruction.
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:gap-4">
          <h2 className="text-xl font-bold lg:text-3xl">
            Expose To Third Parties
          </h2>
          <p className="text-justify text-base lg:text-lg">
            We will not share, sell, or rent your personal information/data to
            any third parties.
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:gap-4">
          <h2 className="text-xl font-bold lg:text-3xl">
            Updates to Privacy Policy
          </h2>
          <p className="text-justify text-base lg:text-lg">
            We may update this Privacy Policy from time to time to reflect
            changes in our practices or for legal and regulatory reasons. Please
            check this page periodically for any updates.
          </p>
        </div>

        <div className="flex flex-col gap-2 lg:gap-4">
          <h2 className="text-xl font-bold lg:text-3xl">Contact Us</h2>
          <p className="text-justify text-base lg:text-lg">
            If you have any questions, concerns, or requests related to this
            Privacy Policy or how we handle your data, please contact us at {}
            <Link href="mailto:dewantorotriatmojo@gmail.com">
              <Button variant="link" className="h-fit p-0 text-base lg:text-lg">
                this email.
              </Button>
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyPage;
