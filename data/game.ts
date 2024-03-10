import { astronomicalObject } from "@/db/schema";
import { db } from "@/lib/drizzle";
import { ModesType } from "@/types/constants";
import { GameData } from "@/types/data";
import { asc, eq, sql } from "drizzle-orm";
import "server-only";

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
  const [[question], options] = await db.batch([questionQuery, optionsQuery]);

  return { question, options };
};
