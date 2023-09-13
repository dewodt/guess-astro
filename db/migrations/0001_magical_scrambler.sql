ALTER TABLE "user" RENAME COLUMN "score" TO "scoreConstellation";--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "scoreMessier" integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "createdAt" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN IF EXISTS "streak";