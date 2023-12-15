import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const StatisticsLoadingPage = () => {
  // Score, Leaderboard Rank, Current Streak, Highest Streak, Win Rate, Match Played
  const data = [
    {
      title: "Score",
    },
    {
      title: "Leaderboard Rank",
    },
    {
      title: "Current Streak",
    },
    {
      title: "Highest Streak",
    },
    {
      title: "Win Rate",
    },
    {
      title: "Match Played",
    },
  ];

  return (
    <main className="grid h-fit w-full grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
      {/* Numbers Data Skeleton */}
      {data.map((item, idx) => (
        <Card className="h-fit shadow-lg" key={idx}>
          <CardHeader className="px-6 pb-2 pt-6">
            <h2 className="text-base font-semibold text-primary">
              {item.title}
            </h2>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-7 w-10" />
          </CardContent>
        </Card>
      ))}

      {/* Charts Data Skeleton */}
      <Card className="col-span-full h-fit shadow-lg">
        <CardHeader className="p-6">
          <h2 className="text-base font-semibold text-primary">
            Current Year Overview
          </h2>
        </CardHeader>
        <CardContent className="flex">
          <Skeleton className="h-[350px] w-full" />
        </CardContent>
      </Card>
    </main>
  );
};

export default StatisticsLoadingPage;
