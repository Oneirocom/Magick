DO $$ BEGIN
 CREATE TYPE "rag"."PackStatus" AS ENUM('pending', 'processing', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "rag"."Job" ALTER COLUMN "status" SET DATA TYPE PackStatus;--> statement-breakpoint
ALTER TABLE "rag"."Loader" ADD COLUMN "status" "rag"."PackStatus" DEFAULT 'pending' NOT NULL;