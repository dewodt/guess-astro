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
import Link from "next/link";

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
                      <TableCell>
                        <Link
                          href={`/user/${user.username}`}
                          className="hover:underline"
                        >
                          {user.username}
                        </Link>
                      </TableCell>
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
