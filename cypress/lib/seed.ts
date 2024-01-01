import {
  match,
  user,
  verificationTokens,
  account,
  session,
} from "../../db/schema";
import { db } from "../../lib/drizzle";
import { matchSeed } from "../fixtures/match";
import { userSeed } from "../fixtures/user";

// Note: DB production secret is different from development secret and test secret
// Don't need to seed astronomicalObject because it will not change

export const seedDatabase = async () => {
  // Reset test database so there is no conflict
  await db.delete(match);
  await db.delete(account);
  await db.delete(user);
  await db.delete(session);
  await db.delete(verificationTokens);

  // Insert user data
  await db.insert(user).values(userSeed);

  // Insert match data
  await db.insert(match).values(matchSeed);
};
