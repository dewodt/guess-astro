import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MessierStatisticsLoadingPage = () => {
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
    <main className="grid h-fit w-full grid-cols-1 gap-5 sm:grid-cols-2">
      {data.map((item, idx) => (
        <Card className="h-fit" key={idx}>
          <CardHeader className="px-6 pb-2 pt-6">
            <h2 className="text-base font-semibold text-primary">
              {item.title}
            </h2>
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 w-10" />
          </CardContent>
        </Card>
      ))}
    </main>
  );
};

export default MessierStatisticsLoadingPage;
