import { type Metadata } from "next";

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
