import "server-only";

import { LeaderboardData } from "@/types/data";
import { ModesType } from "@/types/constants";
import { db } from "@/lib/drizzle";
import { and, desc, eq, sql } from "drizzle-orm";
import { match, user } from "@/db/schema";

// Get leaderboard data
// return Rank, Username, Score
export const getLeaderboardData = async (
  mode: ModesType
): Promise<LeaderboardData> => {
  // Get leaderboard data
  // Left join to preserve all users data even if they don't have any match / score
  // Group by user id and username to count the score
  const leaderboard = await db
    .select({
      id: user.id,
      username: user.username,
      score: sql<number>`count(${match.id})`.as("score"),
    })
    .from(user)
    .leftJoin(
      match,
      and(
        eq(match.userId, user.id),
        eq(match.mode, mode),
        eq(match.result, "win")
      )
    )
    .groupBy(user.id, user.username)
    .orderBy(desc(sql<number>`count(${match.id})`))
    .limit(10);

  return leaderboard;
};
