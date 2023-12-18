import { type Metadata } from "next";
import { getTitleCase } from "@/lib/utils";
import { ModesType } from "@/types/constants";
import { getLeaderboardData } from "@/data/leaderboard";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LeaderboardRow } from "./leaderboard-row";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";

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
    description:
      "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
    metadataBase: new URL("https://astro.dewodt.com"),
    generator: "Next.js",
    applicationName: "Guess Astro",
    keywords: ["Guess Astro", "Astronomy", "Game"],
    category: "education",
    openGraph: {
      title: `${modeTitle} Mode Leaderboard | Guess Astro`,
      description:
        "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
      url: "https://astro.dewodt.com/",
      siteName: "Guess Astro",
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${modeTitle} Mode Leaderboard | Guess Astro`,
      description:
        "Guess Astro is a website to help students memorize astronomical objects for astronomy national science olympiad.",
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
          <h2 className="text-2xl font-bold text-primary">{modeTitle} Mode</h2>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              {/* Header */}
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-10 pr-6 text-center">Rank</TableHead>
                  <TableHead className="w-full px-6">Username</TableHead>
                  <TableHead className="pl-6 pr-10 text-center">
                    Score
                  </TableHead>
                </TableRow>
              </TableHeader>

              {/* Body */}
              <TableBody>
                {data.map((user, idx) => {
                  return (
                    <LeaderboardRow
                      key={user.id}
                      href={`/user/${user.username}`}
                    >
                      <TableCell className="pl-10 pr-6 text-center font-medium">
                        {idx + 1}
                      </TableCell>
                      <TableCell className="w-full px-6">
                        {user.username}
                      </TableCell>
                      <TableCell className="pl-6 pr-10 text-center">
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
