import { type ModesType } from "./constants";

export type GameData = {
  question: {
    id: string;
    mode: ModesType;
    imageQuestionUrl: string;
  };
  options: {
    name: string;
  }[];
};

export type LeaderboardData = {
  username: string | null;
  id: string;
  score: number;
}[];

export type StatisticsData = {
  title: string;
  value: string;
}[];
