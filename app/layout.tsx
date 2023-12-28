import BodyLayout from "./body-layout";
import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "white",
  colorScheme: "light dark",
};

export const metadata: Metadata = {
  description:
    "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  generator: "Next.js",
  applicationName: "Guess Astro",
  keywords: ["Guess Astro", "Astronomy", "Game"],
  category: "education",
  metadataBase: new URL("https://astro.dewodt.com"),
  manifest: "https://astro.dewodt.com/manifest.webmanifest",
};

export const openGraphTemplate: Metadata["openGraph"] = {
  description:
    "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  url: "https://astro.dewodt.com/",
  siteName: "Guess Astro",
  locale: "en_US",
  type: "website",
  images: {
    url: "https://astro.dewodt.com/guess-astro-preview.png",
    width: "1200",
    height: "630",
    alt: "Guess Astro",
  },
};

export const twitterTemplate: Metadata["twitter"] = {
  card: "summary_large_image",
  description:
    "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
  creator: "@dewodt",
  creatorId: "1126695039633989634",
  images: {
    url: "https://astro.dewodt.com/guess-astro-preview.png",
    alt: "Guess Astro",
  },
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <BodyLayout>{children}</BodyLayout>
    </html>
  );
};

export default RootLayout;
