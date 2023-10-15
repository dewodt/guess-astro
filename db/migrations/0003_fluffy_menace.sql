DO $$ BEGIN
 CREATE TYPE "mode" AS ENUM('constellation', 'messier');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "astronomicalObject" RENAME COLUMN "type" TO "mode";--> statement-breakpoint
ALTER TABLE "astronomicalObject" RENAME COLUMN "imageUrl" TO "imageQuestionUrl";--> statement-breakpoint
ALTER TABLE "match" RENAME COLUMN "type" TO "mode";--> statement-breakpoint
ALTER TABLE "astronomicalObject" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "astronomicalObject" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "astronomicalObject" ALTER COLUMN "mode" SET DATA TYPE mode;--> statement-breakpoint
ALTER TABLE "match" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "match" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "match" ALTER COLUMN "astronomicalObjectId" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "match" ALTER COLUMN "mode" SET DATA TYPE mode;--> statement-breakpoint
ALTER TABLE "astronomicalObject" ADD COLUMN "imageAnswerUrl" text NOT NULL;