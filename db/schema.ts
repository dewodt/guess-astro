import { AdapterAccount } from "next-auth/adapters";
import { relations } from "drizzle-orm";
import {
  pgTable,
  text,
  integer,
  timestamp,
  primaryKey,
  pgEnum,
} from "drizzle-orm/pg-core";

// Enums
// Mode enums
export const typeEnum = pgEnum("type", ["constellation", "messier"]);

// Match result enum
export const resultEnum = pgEnum("result", ["win", "lose"]);

// Schemas
// User schema (also for nextauth)
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  email: text("email").unique().notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  username: text("username").unique(),
  name: text("name"),
  image: text("image"),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
});

// Account schema (for next-auth)
export const account = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount["type"]>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey(account.provider, account.providerAccountId),
  })
);

// Session schema (for next-auth)
export const session = pgTable("session", {
  sessionToken: text("sessionToken").notNull().primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// Verification request schema (for next-auth)
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey(vt.identifier, vt.token),
  })
);

// Object schema
export const astonomicalObject = pgTable("astronomicalObject", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  type: typeEnum("type").notNull(),
  imageUrl: text("imageUrl").notNull(),
});

// Match schema
export const match = pgTable("match", {
  id: text("id").primaryKey(),
  mode: typeEnum("type").notNull(),
  createdAt: timestamp("createdAt", { mode: "date" }).defaultNow(),
  result: resultEnum("result").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  astonomicalObjectId: text("astronomicalObjectId")
    .notNull()
    .references(() => astonomicalObject.id, {
      onDelete: "cascade",
    }),
});

// Relation Declarations
// User relations
export const userRelations = relations(user, ({ many }) => ({
  match: many(match),
}));

// Object relations
export const astonomicalObjectRelations = relations(
  astonomicalObject,
  ({ many }) => ({
    match: many(match),
  })
);

// Match relations
export const matchRelations = relations(match, ({ one }) => ({
  user: one(user, {
    fields: [match.userId],
    references: [user.id],
  }),
  object: one(astonomicalObject, {
    fields: [match.astonomicalObjectId],
    references: [astonomicalObject.id],
  }),
}));
