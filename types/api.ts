export interface LeaderboardResponse {
  message: string;
  leaderboard: {
    username: string;
    id: string;
    score: string;
  }[];
}

export interface StatisticsResponse {
  message: string;
  score: string;
  currentStreak: string;
  highestStreak: string;
  leaderboardRank: string;
  matchPlayed: string;
  winRate: string;
}
