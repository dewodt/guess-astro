import { type Metadata } from "next";
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
  const modeTitle = mode.charAt(0).toUpperCase() + mode.slice(1);
  return {
    title: `${modeTitle} Mode Statistics | Guess Astro`,
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
