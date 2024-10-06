import PlayForm from "./play-form";
import { getGameData } from "@/data/game";
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";
import { getRandomInt, getTitleCase } from "@/lib/utils";
import type { ModesType } from "@/types/constants";
import { type Metadata } from "next";

// Force dynamic page
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Generate dynamic metadata
export const generateMetadata = ({
  params: { mode },
}: {
  params: { mode: ModesType };
}): Metadata => {
  // Return title
  const modeTitle = getTitleCase(mode);

  return {
    title: `${modeTitle} Mode Match | Guess Astro`,
    openGraph: {
      ...openGraphTemplate,
      title: `${modeTitle} Mode Match | Guess Astro`,
    },
    twitter: {
      ...twitterTemplate,
      title: `${modeTitle} Mode Match | Guess Astro`,
    },
  };
};

const PlayMatchPage = async ({
  params: { mode },
}: {
  params: { mode: ModesType };
}) => {
  // Get game data
  // Note: mode is already validated in middleware
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
