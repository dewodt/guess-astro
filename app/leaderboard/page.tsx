import { type Metadata } from "next";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SkeletonTable from "./skeleton-table";
import LeaderboardTable from "./leaderboard-table";

export const metadata: Metadata = {
  title: "Leaderboard | Guess Astro",
};

// Force dynamic page
export const dynamic = "force-dynamic";

const LeaderboardPage = () => {
  return (
    <main className="flex flex-auto justify-center bg-muted p-5 sm:p-10">
      <Card className="h-fit w-full max-w-2xl">
        <CardHeader>
          <h1 className="text-center text-3xl font-bold text-primary">
            Leaderboard
          </h1>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="constellation">
            <TabsList className="w-full">
              <TabsTrigger value="constellation" className="w-full">
                Constellation
              </TabsTrigger>
              <TabsTrigger value="messier" className="w-full">
                Messier
              </TabsTrigger>
            </TabsList>

            {/* Constellation Table */}
            {/* Use skeleton as loading progress */}
            <Suspense fallback={<SkeletonTable />}>
              <LeaderboardTable />
            </Suspense>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  );
};

export default LeaderboardPage;
