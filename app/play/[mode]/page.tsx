import { type Metadata } from "next";
import { notFound } from "next/navigation";
import { getRandomInt, getTitleCase } from "@/lib/utils";
import { modes } from "@/lib/constants";
import type { ModesType } from "@/types/constants";
import { getGameData } from "@/lib/get-data";
import PlayForm from "./play-form";

// Force dynamic page
export const dynamic = "force-dynamic";

// Generate dynamic metadata
export const generateMetadata = ({
  params: { mode },
}: {
  params: { mode: ModesType };
}): Metadata => {
  // If params is not valid (mode is not available)
  if (!modes.includes(mode)) {
    return notFound();
  }

  // Return title
  const modeTitle = getTitleCase(mode);

  return {
    title: `${modeTitle} Mode Match | Guess Astro`,
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
      title: `${modeTitle} Mode Match | Guess Astro`,
      description:
        "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
      url: "https://astro.dewodt.com/",
      siteName: "Guess Astro",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${modeTitle} Mode Match | Guess Astro`,
      description:
        "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    },
  };
};

const PlayMatchPage = async ({
  params: { mode },
}: {
  params: { mode: ModesType };
}) => {
  // If params is not valid (mode is not available)
  if (!modes.includes(mode)) {
    return notFound();
  }

  // Get game data
  const data = await getGameData(mode);

  // Get image rotation data
  const rotateDeg = `${getRandomInt(0, 360)}deg`;

  return (
    <main className="flex flex-auto items-center justify-center overflow-x-hidden p-6 py-12 sm:p-12">
      <PlayForm data={data} rotateDeg={rotateDeg} />
    </main>
  );
};

export default PlayMatchPage;
