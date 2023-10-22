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

export type UserDetailData = {
  username: string | null;
  name: string | null;
  image: string | null;
  createdAt: Date | null;
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
