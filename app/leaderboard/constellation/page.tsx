import { type Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Constellation Leaderboard | Guess Astro",
};

// Force dynamic page
export const dynamic = "force-dynamic";

const ConstellationLeaderboardPage = async () => {
  // Get leaderboard data
  const data = await getLeaderboardData("constellation");

  return (
    <main className="w-full">
      <Card className="h-fit w-full max-w-2xl">
        <CardHeader>
          <h2 className="text-2xl font-bold text-primary">
            Constellation Leaderboard
          </h2>
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

export default ConstellationLeaderboardPage;
