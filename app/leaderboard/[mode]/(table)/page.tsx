import { LeaderboardRow } from "./leaderboard-row";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { getLeaderboardData } from "@/data/leaderboard";
import { openGraphTemplate, twitterTemplate } from "@/lib/metadata";
import { getTitleCase } from "@/lib/utils";
import { ModesType } from "@/types/constants";
import { type Metadata } from "next";

// Generate dynamic metadata
export const generateMetadata = ({
  params: { mode },
}: {
  params: { mode: ModesType };
}): Metadata => {
  // Return title
  const modeTitle = getTitleCase(mode);

  return {
    title: `${modeTitle} Mode Leaderboard | Guess Astro`,
    openGraph: {
      ...openGraphTemplate,
      title: `${modeTitle} Mode Leaderboard | Guess Astro`,
    },
    twitter: {
      ...twitterTemplate,
      title: `${modeTitle} Mode Leaderboard | Guess Astro`,
    },
  };
};

// Force dynamic page
export const dynamic = "force-dynamic";

const LeaderboardPage = async ({
  params: { mode },
}: {
  params: { mode: ModesType };
}) => {
  // Get mode title
  const modeTitle = getTitleCase(mode);

  // Get leaderboard data
  // Note: mode is already validated in middleware
  const data = await getLeaderboardData(mode);

  return (
    <main className="w-full">
      <Card className="h-fit w-full shadow-lg">
        <CardHeader>
          <h2
            data-cy="leaderboard-title"
            className="text-2xl font-bold text-primary"
          >
            {modeTitle} Mode
          </h2>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              {/* Header */}
              <TableHeader>
                <TableRow>
                  <TableHead
                    data-cy="leaderboard-table-header-0"
                    className="pl-10 pr-6 text-center"
                  >
                    Rank
                  </TableHead>
                  <TableHead
                    data-cy="leaderboard-table-header-1"
                    className="w-full px-6"
                  >
                    Username
                  </TableHead>
                  <TableHead
                    data-cy="leaderboard-table-header-2"
                    className="pl-6 pr-10 text-center"
                  >
                    Score
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {data.map((user, idx) => {
                  return (
                    <LeaderboardRow
                      data-cy={`leaderboard-table-body-${idx}`}
                      key={user.id}
                      href={`/user/${user.username}`}
                    >
                      <TableCell
                        data-cy={`leaderboard-table-body-${idx}-0`}
                        className="pl-10 pr-6 text-center font-medium"
                      >
                        {idx + 1}
                      </TableCell>
                      <TableCell
                        data-cy={`leaderboard-table-body-${idx}-1`}
                        className="w-full px-6"
                      >
                        {user.username}
                      </TableCell>
                      <TableCell
                        data-cy={`leaderboard-table-body-${idx}-2`}
                        className="pl-6 pr-10 text-center"
                      >
                        {user.score}
                      </TableCell>
                    </LeaderboardRow>
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
