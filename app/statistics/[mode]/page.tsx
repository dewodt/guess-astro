import { type Metadata } from "next";
import { getTitleCase } from "@/lib/utils";
import { getStatisticsData } from "@/lib/get-data";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ModesType } from "@/types/constants";
import { modes } from "@/lib/constants";
import { notFound } from "next/navigation";

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
    title: `${modeTitle} Mode Statistics | Guess Astro`,
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    metadataBase: new URL("https://astro.dewodt.com"),
    generator: "Next.js",
    applicationName: "Guess Astro",
    keywords: ["Guess Astro", "Astronomy", "Game"],
    category: "education",
    openGraph: {
      title: `${modeTitle} Mode Statistics | Guess Astro`,
      description:
        "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
      url: "https://astro.dewodt.com/",
      siteName: "Guess Astro",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${modeTitle} Mode Statistics | Guess Astro`,
      description:
        "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    },
  };
};

const StatisticsPage = async ({
  params: { mode },
}: {
  params: { mode: ModesType };
}) => {
  // If params is not valid (mode is not available)
  if (!modes.includes(mode)) {
    return notFound();
  }

  const data = await getStatisticsData(mode);

  return (
    <main className="grid h-fit w-full grid-cols-1 gap-5 sm:grid-cols-2">
      {/* Map Items */}
      {data.map((item, idx) => (
        <Card className="h-fit shadow-lg" key={idx}>
          <CardHeader className="px-6 pb-2 pt-6">
            <h2 className="text-base font-semibold text-primary">
              {item.title}
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">{item.value}</p>
          </CardContent>
        </Card>
      ))}
    </main>
  );
};

export default StatisticsPage;
