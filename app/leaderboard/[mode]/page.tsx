import { notFound } from "next/navigation";
import { type Metadata } from "next";
import { getTitleCase } from "@/lib/utils";
import { ModesType } from "@/types/constants";
import { modes } from "@/lib/constants";
import { getLeaderboardData } from "@/lib/get-data";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
    title: `${modeTitle} Mode Leaderboard | Guess Astro`,
  };
};

// Force dynamic page
export const dynamic = "force-dynamic";

const LeaderboardPage = async ({
  params: { mode },
}: {
  params: { mode: ModesType };
}) => {
  // If params is not valid (mode is not available)
  if (!modes.includes(mode)) {
    return notFound();
  }

  // Get mode title
  const modeTitle = getTitleCase(mode);

  // Get leaderboard data
  const data = await getLeaderboardData(mode);

  return (
    <main className="w-full">
      <Card className="h-fit w-full max-w-2xl shadow-lg">
        <CardHeader>
          <h2 className="text-2xl font-bold text-primary">{modeTitle} Mode</h2>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              {/* Header */}
              <TableHeader>
                <TableRow>
                  <TableHead>Rank</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Score</TableHead>
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {data.map((user, idx) => {
                  return (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{idx + 1}</TableCell>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.score}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default LeaderboardPage;