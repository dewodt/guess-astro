export interface LeaderboardResponse {
  leaderboardConstellation: {
    id: string;
    username: string;
    scoreConstellation: number;
  }[];
  leaderboardMessier: {
    id: string;
    username: string;
    scoreMessier: number;
  }[];
  message: string;
}

export interface StatisticsResponse {
  score: string;
  currentStreak: string;
  highestStreak: string;
  leaderboardRank: string;
  matchPlayed: string;
  winRate: string;
}
