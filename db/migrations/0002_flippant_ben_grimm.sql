DO $$ BEGIN
 CREATE TYPE "result" AS ENUM('win', 'lose');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "type" AS ENUM('constellation', 'messier');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "astronomicalObject" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"type" "type" NOT NULL,
	"imageUrl" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "match" (
	"id" text PRIMARY KEY NOT NULL,
	"type" "type" NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"result" "result" NOT NULL,
	"userId" text NOT NULL,
	"astronomicalObjectId" text NOT NULL
);
--> statement-breakpoint
DROP TABLE "constellation";--> statement-breakpoint
DROP TABLE "messier";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "scoreConstellation";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "scoreMessier";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "match" ADD CONSTRAINT "match_astronomicalObjectId_astronomicalObject_id_fk" FOREIGN KEY ("astronomicalObjectId") REFERENCES "astronomicalObject"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
