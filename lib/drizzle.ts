import { neon, neonConfig } from "@neondatabase/serverless";
import * as schema from "../db/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DRIZZLE_DATABASE_URL!);
export const db = drizzle(sql, { schema });

// this will automatically run needed migrations on the database
migrate(db, { migrationsFolder: "db/migrations" });
