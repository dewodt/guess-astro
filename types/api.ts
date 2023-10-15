export type MatchPostResponseJson = {
  isWin: boolean;
  correctAnswerName: string;
  correctAnswerImageUrl?: string;
  error?: string;
  message?: string;
};

export type UserPutResponseJson = {
  error?: string;
  message?: string;
};
