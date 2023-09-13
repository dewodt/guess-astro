// Get user lists for leaderboard
// Data: Rank, Username, Name, Score, Streak

import { type NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/drizzle";
import { user } from "@/db/schema";
import { asc, desc } from "drizzle-orm";

// Force dynamic
export const dynamic = "force-dynamic";

// Get leaderboard data
// Only return non sensitive data (username & score)
export const GET = async (req: NextRequest) => {
  // Get user score constellation data
  const leaderboardConstellationQuery = db
    .select({
      id: user.id,
      username: user.username,
      scoreConstellation: user.scoreConstellation,
    })
    .from(user)
    .orderBy(desc(user.scoreConstellation), asc(user.username))
    .limit(10);

  // Get user score messier data
  const leaderboardMessierQuery = db
    .select({
      id: user.id,
      username: user.username,
      scoreMessier: user.scoreMessier,
    })
    .from(user)
    .orderBy(desc(user.scoreMessier), asc(user.username))
    .limit(10);

  // Fetch parallely
  const [leaderboardConstellation, leaderboardMessier] = await Promise.all([
    leaderboardConstellationQuery,
    leaderboardMessierQuery,
  ]);

  return NextResponse.json(
    { leaderboardConstellation, leaderboardMessier, message: "Success" },
    { status: 200 }
  );
};
