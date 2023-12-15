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
// Return score, leaderboard rank, current streak, highest streak, win rate, match played
export const getStatisticsData = async (
  mode: ModesType
): Promise<StatisticsData> => {
  // Get user's session
  // User's session is already validated via middleware.
  const session = await getServerSession(authOptions);

  // Get user's leaderboard rank
  // Need to compare to other user's data
  // Subquery to get all user's rank
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
        and(eq(match.mode, mode), eq(match.result, "win"))
      )
    )
    .groupBy(user.id, user.username)
    .orderBy(desc(sql<number>`count(${match.id})`))
    .as("sq");
  // Query to get specific user's rank
  const userLeaderboard = db.select().from(sq).where(eq(sq.id, session!.id));

  // Get user's matches, total match played, streak, and current streak.
  // Don't need to compare to other user's data
  const userMatches = db
    .select({ id: match.id, result: match.result })
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

  // Get this year's user match statistics per month, group per month using the character (e.g. Jan, Feb, ect) and count frequency
  // Note: if no acticity, then no data will be returned
  const userMatchesThisYearDirty = await db
    .select({
      month: sql<string>`extract(month from ${match.createdAt})`.as("month"),
      count: sql<string>`count(${match.id})`.as("count"),
    })
    .from(match)
    .where(
      and(
        eq(match.userId, session!.id),
        eq(match.mode, mode),
        eq(
          sql<string>`extract(year from ${match.createdAt})`,
          sql<string>`extract(year from now())`
        )
      )
    )
    .groupBy(sql<string>`extract(month from ${match.createdAt})`);

  // Clean the data, get all 12 months and fill the missing month with 0
  const userMatchesThisYearClean = Array.from({ length: 12 }, (_, i) => {
    const month = userMatchesThisYearDirty.find(
      // Note: month in sql starts from 1, but in js starts from 0
      (m) => parseInt(m.month) == i + 1
    );

    return {
      month: getShortMonth(i),
      score: month ? parseInt(month.count) : 0,
    };
  });

  return {
    chartData: userMatchesThisYearClean,
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
        title: "Win Rate",
        value: winRate,
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
