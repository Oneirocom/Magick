CREATE SCHEMA IF NOT EXISTS rag;
SET search_path TO rag;

--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "rag"."JobStatus" AS ENUM('pending', 'processing', 'completed', 'failed');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "rag"."LoaderType" AS ENUM('text', 'youtube', 'youtube_channel', 'youtube_search', 'web', 'sitemap', 'pdf', 'docx', 'excel', 'ppt', 'confluence', 'json');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."PromotionType" AS ENUM('INTRO', 'ADMIN', 'SUBSCRIPTION');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."SubscriptionType" AS ENUM('FREE', 'STANDARD', 'PREMIUM');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."TemplateType" AS ENUM('OFFICIAL', 'COMMUNITY');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."TransactionSource" AS ENUM('PROMOTION', 'BUDGET');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."WebhookMethod" AS ENUM('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'CONNECT', 'TRACE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."WebhookStatus" AS ENUM('ACTIVE', 'REJECTED', 'SUCCESS', 'FAILURE');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rag"."Job" (
	"id" text PRIMARY KEY NOT NULL,
	"entity" text NOT NULL,
	"packId" text NOT NULL,
	"loaders" jsonb[],
	"createdAt" timestamp(3) DEFAULT now() NOT NULL,
	"finishedAt" timestamp(3),
	"status" "rag"."JobStatus" DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rag"."Loader" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"packId" text NOT NULL,
	"type" "rag"."LoaderType" NOT NULL,
	"config" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rag"."Pack" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"description" text,
	"owner" text NOT NULL,
	"entity" text NOT NULL,
	"shared" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rag"."Job" ADD CONSTRAINT "Job_packId_Pack_id_fk" FOREIGN KEY ("packId") REFERENCES "rag"."Pack"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rag"."Loader" ADD CONSTRAINT "Loader_packId_Pack_id_fk" FOREIGN KEY ("packId") REFERENCES "rag"."Pack"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
