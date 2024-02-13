import { user } from "@/db/schema";
import { db } from "@/lib/drizzle";
import { UserDetailData } from "@/types/data";
import { ilike } from "drizzle-orm";
import "server-only";

// Get user data for user detail page from user's username (CASE INSENSITIVE)
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
    .where(ilike(user.username, username)); // Case insensitive search

  if (userData.length === 0) {
    return null;
  }

  return userData[0];
};
