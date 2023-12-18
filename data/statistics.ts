import "server-only";

import { StatisticsData } from "@/types/data";
import { ModesType } from "@/types/constants";
import { db } from "@/lib/drizzle";
import { and, desc, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { match, user } from "@/db/schema";
import { getShortMonth } from "@/lib/utils";

// Get users data statistics of a certain mode
// Return score, leaderboard rank, current streak, highest streak, accuracy, match played
export const getStatisticsData = async (
  mode: ModesType
): Promise<StatisticsData> => {
  // Get user's session
  // User's session is already validated via middleware.
  const session = await getServerSession(authOptions);

  // Get user's leaderboard rank and score
  // Need to compare to other user's data but not fetch all user's data (waste of resource)
  // Subquery to get all user's rank and score
  // Left join and group by user id and username to count the score
  const sq = db
    .select({
      id: user.id,
      username: user.username,
      score: sql<number>`count(${match.id})`.as("score"),
      rank: sql<number>`rank() over (order by count(${match.id}) desc, ${user.username} asc)`.as(
        "rank"
      ),
    })
    .from(user)
    .leftJoin(
      match,
      and(
        eq(match.userId, user.id),
        eq(match.mode, mode),
        eq(match.result, "correct")
      )
    )
    .groupBy(user.id, user.username)
    .orderBy(desc(sql<number>`count(${match.id})`))
    .as("sq");
  // Query to get specific user's rank and score
  const userLeaderboard = db.select().from(sq).where(eq(sq.id, session!.id));

  // Get user's matches, total match played, streak, current streak, and chart graph.
  // Don't need to compare to other user's data
  const userMatches = db
    .select({ id: match.id, result: match.result, createdAt: match.createdAt })
    .from(match)
    .where(and(eq(match.userId, session!.id), eq(match.mode, mode)))
    .orderBy(desc(match.createdAt));

  // Fetch data paralelly to reduce wait time and because data is independent of each other
  const [matches, [{ score, rank }]] = await Promise.all([
    userMatches,
    userLeaderboard,
  ]);

  // Get current streak
  let currentStreak = 0;
  for (let i = 0; i < matches.length; i++) {
    // Found atleast 1 incorrect, exit.
    if (matches[i].result === "incorrect") {
      break;
    }
    // Add more streak
    currentStreak += 1;
  }

  // Get highest streak
  let highestStreak = 0;
  let temp = 0;
  for (let j = 0; j < matches.length; j++) {
    // Found atleast 1 incorrect, reset temp.
    if (matches[j].result === "incorrect") {
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

  // Get accuracy
  const accuracy =
    matchPlayed !== 0 ? `${((score / matchPlayed) * 100).toFixed(2)}%` : "0%";

  // Get chart data
  // Initialize chart array with 0 score
  const chartData = Array.from({ length: 12 }, (_, i) => {
    return {
      month: getShortMonth(i),
      score: 0,
    };
  });

  // Count correct matches per month
  matches.forEach((m) => {
    if (m.result === "correct" && m.createdAt) {
      const month = m.createdAt.getMonth();
      chartData[month].score += 1;
    }
  });

  return {
    chartData: chartData,
    numberData: [
      {
        title: "Score",
        value: score.toString(),
      },
      {
        title: "Leaderboard Rank",
        value: rank.toString(),
      },
      {
        title: "Accuracy",
        value: accuracy,
      },
      {
        title: "Match Played",
        value: matchPlayed.toString(),
      },
      {
        title: "Current Streak",
        value: currentStreak.toString(),
      },
      {
        title: "Highest Streak",
        value: highestStreak.toString(),
      },
    ],
  };
};
