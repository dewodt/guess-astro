import { type NextRequest, NextResponse } from "next/server";
import { modes } from "@/lib/constants";
import { db } from "@/lib/drizzle";

// Force dynamic
export const dynamic = "force-dynamic";

// Get leaderboard data
// return Rank, Username, Score
export const GET = async (
  req: NextRequest,
  { params: { mode } }: { params: { mode: (typeof modes)[number] } }
) => {
  // Validate mode
  if (!modes.includes(mode)) {
    return NextResponse.json(
      { message: "Invalid request params", error: "Bad Request" },
      { status: 400 }
    );
  }

  // Get all users and matches data for leaderboard
  const usersAndMatches = await db.query.user.findMany({
    columns: { id: true, username: true },
    with: {
      match: {
        where: (match, { eq }) => eq(match.mode, mode),
        orderBy: (match, { desc }) => desc(match.createdAt),
      },
    },
  });

  // Get win matches
  const usersAndWinMatches = usersAndMatches.map((userAndMatch) => {
    // filter win matches
    const winMatches = userAndMatch.match.filter(
      (match) => match.result === "win"
    );
    return { ...userAndMatch, match: winMatches };
  });
  // Sort to get highest win
  usersAndWinMatches.sort((a, b) => b.match.length - a.match.length);
  // Only return username and id for leaderboard
  const leaderboard = usersAndWinMatches
    .map(({ username, id, match }) => {
      return {
        username,
        id,
        score: match.length,
      };
    })
    .slice(0, 10);

  return NextResponse.json(
    { message: "Success", leaderboard },
    { status: 200 }
  );
};
