import { StatisticsChart } from "./statistics-chart";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { getStatisticsData } from "@/data/statistics";
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";
import { getTitleCase } from "@/lib/utils";
import { ModesType } from "@/types/constants";
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
    title: `${modeTitle} Mode Statistics | Guess Astro`,
    openGraph: {
      ...openGraphTemplate,
      title: `${modeTitle} Mode Statistics | Guess Astro`,
    },
    twitter: {
      ...twitterTemplate,
      title: `${modeTitle} Mode Statistics | Guess Astro`,
    },
  };
};

const StatisticsPage = async ({
  params: { mode },
}: {
  params: { mode: ModesType };
}) => {
  // Get data
  // Note: mode is already validated in middleware
  const data = await getStatisticsData(mode);

  return (
    <main className="grid h-fit w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      {/* Numbers Data */}
      {data.numberData.map((item, idx) => (
        <Card className="h-fit shadow-lg" key={idx}>
          <CardHeader className="px-6 pb-2 pt-6">
            <h2
              data-cy={`statistics-${item.title
                .replace(" ", "-")
                .toLowerCase()}-title`}
              className="text-base font-semibold text-primary"
            >
              {item.title}
            </h2>
          </CardHeader>
          <CardContent>
            <p
              data-cy={`statistics-${item.title
                .replace(" ", "-")
                .toLowerCase()}-value`}
              className="text-xl font-bold"
            >
              {item.value}
            </p>
          </CardContent>
        </Card>
      ))}

      {/* Charts Data */}
      <Card className="col-span-full h-fit shadow-lg">
        <CardHeader className="p-6">
          <h2
            data-cy="statistics-last-12-months-title"
            className="text-base font-semibold text-primary"
          >
            Last 12 Months
          </h2>
        </CardHeader>
        <CardContent data-cy="statistics-last-12-months-chart">
          <StatisticsChart chartData={data.chartData} />
        </CardContent>
      </Card>
    </main>
  );
};

export default StatisticsPage;
