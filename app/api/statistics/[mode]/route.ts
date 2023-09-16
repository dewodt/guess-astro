import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

// Force dynamic
export const dynamic = "force-dynamic";

// Available modes
const modes = ["constellation", "messier"] as const;

// Get users data statistics of a certain mode
// Return score, leaderboard rank, current streak, highest streak, win rate, match played
export const GET = async (
  req: NextRequest,
  { params: { mode } }: { params: { mode: (typeof modes)[number] } }
) => {
  // Check if user is authenticated or no
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized request",
        message: "Please sign in to have access.",
      },
      { status: 401 }
    );
  }

  // Mode validation
  if (!modes.includes(mode)) {
    return NextResponse.json(
      { error: "Bad Request", message: "Invalid request params" },
      { status: 400 }
    );
  }

  // Get all users and matches data for certain mode (for current leaderboard rank + streak)
  const usersAndMatches = await db.query.user.findMany({
    columns: { id: true, username: true },
    with: {
      match: {
        where: (match, { eq }) => eq(match.mode, mode),
        orderBy: (match, { desc }) => desc(match.createdAt),
      },
    },
  });

  // Get user's matches data
  const matches = usersAndMatches.find(
    (userAndMatch) => userAndMatch.id === session.id
  )!.match;

  // Get score
  const score = matches.filter((match) => match.result === "win").length;

  // Get leaderboard rank
  let leaderboardRank = "-";
  if (score) {
    // Get win matches
    const usersAndWinMatches = usersAndMatches.map((userAndMatch) => {
      // filter win matches
      const winMatches = userAndMatch.match.filter(
        (match) => match.result === "win"
      );
      return { ...userAndMatch, match: winMatches };
    });
    usersAndWinMatches.sort((a, b) => b.match.length - a.match.length);

    // Update rank
    leaderboardRank = `#${
      1 +
      usersAndWinMatches.findIndex(
        (userAndMatch) => userAndMatch.id === session.id
      )
    }`;
  }

  // Get current streak
  let currentStreak = 0;
  for (let i = 0; i < matches.length; i++) {
    // Found atleast 1 lose, exit.
    if (matches[i].result === "lose") {
      break;
    }
    // Add more streak
    currentStreak += 1;
  }

  // Get highest streak
  let highestStreak = 0;
  let temp = 0;
  for (let j = 0; j < matches.length; j++) {
    // Found atleast 1 lose, reset temp.
    if (matches[j].result === "lose") {
      temp = 0;
    } else {
      // Add more streak
      temp += 1;
    }

    // Update highest streak
    if (temp > highestStreak) {
      highestStreak = temp;
    }
  }

  // Get number of match played
  const matchPlayed = matches.length;

  // Get win rate
  const winRate =
    matchPlayed !== 0 ? `${((score / matchPlayed) * 100).toFixed(2)}%` : "0%";

  return NextResponse.json(
    {
      score,
      currentStreak,
      highestStreak,
      leaderboardRank,
      matchPlayed,
      winRate,
    },
    { status: 200 }
  );
};
