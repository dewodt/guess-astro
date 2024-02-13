import { match, user } from "@/db/schema";
import { authOptions } from "@/lib/auth-options";
import { db } from "@/lib/drizzle";
import { getShortMonth } from "@/lib/utils";
import { ModesType } from "@/types/constants";
import { StatisticsData } from "@/types/data";
import { subDays, subMonths } from "date-fns";
import { and, desc, eq, gte, isNotNull, sql } from "drizzle-orm";
import { type Session, getServerSession } from "next-auth";
import "server-only";

const getScoreAndRank = async (userId: string, mode: ModesType) => {
  // Need to compare to other user's data but not fetch all user's data (waste of resource)
  // Subquery to get all user's rank and score
  // Left join and group by user id and username to count the score
  const sq = db
    .select({
      id: user.id,
      username: user.username,
      score: sql<string>`count(${match.id})`.as("score"),
      rank: sql<string>`rank() over (order by count(${match.id}) desc, ${user.username} asc)`.as(
        "rank"
      ),
    })
    .from(user)
    .where(isNotNull(user.username))
    .leftJoin(
      match,
      and(
        eq(match.userId, user.id),
        eq(match.mode, mode),
        eq(match.result, "correct")
      )
    )
    .groupBy(user.id, user.username)
    .as("sq");

  // Query to get specific user's rank and score
  const promise = db.select().from(sq).where(eq(sq.id, userId));

  return promise;
};

const getHighestAndCurrentStreak = async (userId: string, mode: ModesType) => {
  // GET STREAK
  // Get user match of a certain mode
  const userMatchesMode = db
    .select()
    .from(match)
    .where(and(eq(match.userId, userId), eq(match.mode, mode)))
    .as("userMatchesMode");

  // Get user's streak
  const sq = db
    .select({
      createdAt: userMatchesMode.createdAt,
      result: userMatchesMode.result,
      grp: sql<string>`ROW_NUMBER() OVER (ORDER BY ${userMatchesMode.createdAt}) - ROW_NUMBER() OVER (PARTITION BY ${userMatchesMode.result} ORDER BY ${userMatchesMode.createdAt})`.as(
        "grp"
      ),
    })
    .from(userMatchesMode)
    .as("sq");

  // Get streak count
  const streaks = db
    .select({
      id: sql<string>`ROW_NUMBER() OVER (ORDER BY MIN(${sq.createdAt}))`.as(
        "id"
      ),
      count: sql<string>`COUNT(*)`.as("count"),
      result: sq.result,
    })
    .from(sq)
    .groupBy(sq.grp, sq.result)
    .orderBy(desc(sql`id`))
    .as("streaks");

  // Get highest streak query
  const highestStreakPromise = db
    .select({
      highestStreak: sql<string>`MAX(${streaks.count})`.as("highestStreak"),
    })
    .from(streaks);

  // Get current streak query
  const currentStreakPromise = db
    .select({
      currentStreak: sql<string>`
        CASE
          WHEN ${streaks.result} = 'correct' THEN ${streaks.count}
          ELSE 0
        END
    `.as("currentStreak"),
    })
    .from(streaks)
    .orderBy(desc(sql`id`))
    .limit(1);

  return Promise.all([highestStreakPromise, currentStreakPromise]);
};

const getChartData = async (userId: string, mode: ModesType) => {
  // Get last 12 months score data
  const dateNow = new Date();
  const dateLast12Months = subDays(
    subMonths(dateNow, 11), // Current month is included
    dateNow.getDate() - 1 // Get first day of the month
  );

  // Get month and score
  const chartPromise = db
    .select({
      month: sql<string>`to_char(${match.createdAt}, 'Mon')`.as("month"),
      score: sql<string>`count(${match.id})`.as("score"),
    })
    .from(match)
    .where(
      and(
        eq(match.userId, userId),
        eq(match.mode, mode),
        eq(match.result, "correct"),
        gte(match.createdAt, dateLast12Months)
      )
    )
    .groupBy(sql`month`);

  return chartPromise;
};

const getMatchPlayed = async (userId: string, mode: ModesType) => {
  const matchPlayedPromise = db
    .select({
      matchPlayed: sql<string>`count(${match.id})`.as("matchPlayed"),
    })
    .from(match)
    .where(and(eq(match.userId, userId), eq(match.mode, mode)));

  return matchPlayedPromise;
};

// Return score, leaderboard rank, current streak, highest streak, accuracy, match played
export const getStatisticsData = async (
  mode: ModesType
): Promise<StatisticsData> => {
  // Get user's session
  // User's session is already validated via middleware.
  const session = (await getServerSession(authOptions)) as Session;

  // Parallelize all queries
  const [
    [tempScoreRank],
    [[tempHighestStreak], [tempCurrentStreak]],
    tempChartData,
    [tempMatchPlayed],
  ] = await Promise.all([
    getScoreAndRank(session.id, mode),
    getHighestAndCurrentStreak(session.id, mode),
    getChartData(session.id, mode),
    getMatchPlayed(session.id, mode),
  ]);

  // Get score and rank
  const score = parseInt(tempScoreRank.score);
  const rank = parseInt(tempScoreRank.rank);

  // Get match played
  const matchPlayed = parseInt(tempMatchPlayed.matchPlayed);

  // Get highest and current streak
  const highestStreak = tempHighestStreak.highestStreak ?? 0;
  const currentStreak = tempCurrentStreak ? tempCurrentStreak.currentStreak : 0;

  // Calculate accuracy
  const accuracy = (matchPlayed == 0 ? 0 : (score / matchPlayed) * 100).toFixed(
    2
  );

  // Fill in missing months with 0 score & parse to integer
  const dateNow = new Date();
  const dateLast12Months = subDays(
    subMonths(dateNow, 11), // Current month is included
    dateNow.getDate() - 1 // Get first day of the month
  );
  const chartData = Array.from({ length: 12 }, (_, i) => i).map((_, i) => {
    const monthIdx = (dateLast12Months.getMonth() + i) % 12;
    const monthString = getShortMonth(monthIdx);
    const monthData = tempChartData.find((data) => data.month === monthString);
    if (!monthData) {
      return { month: monthString, score: 0 };
    }
    return {
      month: monthString,
      score: parseInt(monthData.score),
    };
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
        value: `${accuracy}%`,
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
