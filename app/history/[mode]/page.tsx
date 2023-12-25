import { HistoryTableShell } from "./table-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getHistoryData } from "@/data/history";
import { getTitleCase } from "@/lib/utils";
import { ModesType } from "@/types/constants";
import { type Metadata } from "next";

// Force dynamic page
export const dynamic = "force-dynamic";

// Generate dynamic metadata
export const generateMetadata = ({
  params: { mode },
}: {
  params: { mode: ModesType };
}): Metadata => {
  // Return title
  const modeTitle = getTitleCase(mode);

  return {
    title: `${modeTitle} Mode History | Guess Astro`,
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    metadataBase: new URL("https://astro.dewodt.com"),
    generator: "Next.js",
    applicationName: "Guess Astro",
    keywords: ["Guess Astro", "Astronomy", "Game"],
    category: "education",
    openGraph: {
      title: `${modeTitle} Mode History | Guess Astro`,
      description:
        "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
      url: "https://astro.dewodt.com/",
      siteName: "Guess Astro",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${modeTitle} Mode History | Guess Astro`,
      description:
        "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    },
  };
};

const HistoryDetailPage = async ({
  params: { mode },
  searchParams,
}: {
  params: { mode: ModesType };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  // Get mode title
  const modeTitle = getTitleCase(mode);

  // Get data
  // Note: Mode is validated in middleware.
  const { allHistory, pageCount } = await getHistoryData(mode, searchParams);

  return (
    <main className="w-full">
      <Card className="h-fit w-full shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-primary">{modeTitle} Mode</h2>
        </CardHeader>
        <CardContent>
          <HistoryTableShell data={allHistory} pageCount={pageCount} />
        </CardContent>
      </Card>
    </main>
  );
};

export default HistoryDetailPage;
