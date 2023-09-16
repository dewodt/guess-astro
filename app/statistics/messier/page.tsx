import { type Metadata } from "next";
import { getStatisticsData } from "@/lib/get-data";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Messier Statistics | Guess Astro",
};

// Force dynamic page
export const dynamic = "force-dynamic";

const MessierStatisticsPage = async () => {
  const data = await getStatisticsData("messier");

  return (
    <main className="grid h-fit w-full grid-cols-1 gap-5 sm:grid-cols-2">
      {/* Map Items */}
      {data.map((item, idx) => (
        <Card className="h-fit" key={idx}>
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

export default MessierStatisticsPage;
