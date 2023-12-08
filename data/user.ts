import "server-only";

import { UserDetailData } from "@/types/data";
import { db } from "@/lib/drizzle";
import { eq } from "drizzle-orm";
import { user } from "@/db/schema";

// Get user data for user detail page
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
    .where(eq(user.username, username));

  if (userData.length === 0) {
    return null;
  }

  return userData[0];
};
