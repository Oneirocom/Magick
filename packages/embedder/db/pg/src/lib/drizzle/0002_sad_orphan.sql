ALTER TABLE "rag"."Loader" ADD COLUMN "raw" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
ALTER TABLE "rag"."Loader" ADD COLUMN "meta" jsonb DEFAULT '{}'::jsonb;