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
