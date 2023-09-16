import { LeaderboardData, StatisticsData } from "@/types/get-data";
import { modes } from "@/lib/constants";
import { db } from "@/lib/drizzle";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// Get leaderboard data
// return Rank, Username, Score
export const getLeaderboardData = async (
  mode: (typeof modes)[number]
): Promise<LeaderboardData> => {
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
    .map((user) => {
      return {
        username: user.username!,
        id: user.id,
        score: user.match.length.toString(),
      };
    })
    .slice(0, 10);

  return leaderboard;
};

// Get users data statistics of a certain mode
// Return score, leaderboard rank, current streak, highest streak, win rate, match played
export const getStatisticsData = async (
  mode: (typeof modes)[number]
): Promise<StatisticsData> => {
  // Check if user is authenticated or no
  const session = await getServerSession(authOptions);

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
    (userAndMatch) => userAndMatch.id === session!.id
  )!.match;

  // Get score
  const score = matches.filter((match) => match.result === "win").length;

  // Get leaderboard rank
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
  const leaderboardRank = `#${
    1 +
    usersAndWinMatches.findIndex(
      (userAndMatch) => userAndMatch.id === session!.id
    )
  }`;

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
      value: leaderboardRank,
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
