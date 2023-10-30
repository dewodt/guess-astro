import { registerOrUpdateUserSchema } from "@/lib/zod";
import { z } from "zod";

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
  paths?: {
    path: keyof z.infer<typeof registerOrUpdateUserSchema>;
    message: string;
  }[];
};
