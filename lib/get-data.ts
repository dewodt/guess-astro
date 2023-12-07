import {
  GameData,
  LeaderboardData,
  StatisticsData,
  UserDetailData,
} from "@/types/get-data";
import { ModesType } from "@/types/constants";
import { db } from "@/lib/drizzle";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth-options";
import { match, user, astronomicalObject } from "@/db/schema";

// Get game data (generate game data)
export const getGameData = async (mode: ModesType): Promise<GameData> => {
  // Get random astronomical object for certain mode
  const questionQuery = db
    .select({
      id: astronomicalObject.id,
      mode: astronomicalObject.mode,
      imageQuestionUrl: astronomicalObject.imageQuestionUrl,
    })
    .from(astronomicalObject)
    .where(eq(astronomicalObject.mode, mode))
    .orderBy(sql`random()`)
    .limit(1);

  // Get all possible answer for dropdown choices
  const optionsQuery = db
    .select({ name: astronomicalObject.name })
    .from(astronomicalObject)
    .where(eq(astronomicalObject.mode, mode))
    .orderBy(asc(astronomicalObject.name));

  // Paralel query to reduce wait time
  const [[question], options] = await Promise.all([
    questionQuery,
    optionsQuery,
  ]);

  return { question, options };
};

// Get user data for user detail page
// Return username, full name, and profile picture, joined date.
export const getUserDetailData = async (
  username: string
): Promise<UserDetailData | null> => {
  const userData = await db
    .select({
      username: user.username,
      name: user.name,
      image: user.image,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.username, username));

  if (userData.length === 0) {
    return null;
  }

  return userData[0];
};

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
        and(eq(match.mode, mode), eq(match.result, "win"))
      )
    )
    .groupBy(user.id, user.username)
    .orderBy(desc(sql<number>`count(${match.id})`))
    .limit(10);

  return leaderboard;
};

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

  return [
    {
      title: "Score",
      value: score.toString(),
    },
    {
      title: "Leaderboard Rank",
      value: rank.toString(),
    },
    {
      title: "Current Streak",
      value: currentStreak.toString(),
    },
    {
      title: "Highest Streak",
      value: highestStreak.toString(),
    },
    {
      title: "Win Rate",
      value: winRate,
    },
    {
      title: "Match Played",
      value: matchPlayed.toString(),
    },
  ];
};
