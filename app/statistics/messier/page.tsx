import { type Metadata } from "next";
import { headers } from "next/headers";
import { getBaseUrl } from "@/lib/utils";
import type { StatisticsResponse } from "@/types/api";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Messier Statistics | Guess Astro",
};

// Force dynamic page
export const dynamic = "force-dynamic";

const MessierStatisticsPage = async () => {
  const baseUrl = getBaseUrl();
  const res = await fetch(`${baseUrl}/api/statistics/messier`, {
    method: "GET",
    cache: "no-store",
    headers: headers(),
  });
  const resJSON = (await res.json()) as StatisticsResponse;

  // Create structure to ease mapping
  const data = [
    {
      title: "Score",
      value: resJSON.score,
    },
    {
      title: "Leaderboard Rank",
      value: resJSON.leaderboardRank,
    },
    {
      title: "Current Streak",
      value: resJSON.currentStreak,
    },
    {
      title: "Highest Streak",
      value: resJSON.highestStreak,
    },
    {
      title: "Win Rate",
      value: resJSON.winRate,
    },
    {
      title: "Match Played",
      value: resJSON.matchPlayed,
    },
  ];

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
