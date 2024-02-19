-- AlterTable
ALTER TABLE "public"."graphEvents" ADD COLUMN     "channel" VARCHAR(255),
ALTER COLUMN "content" SET DATA TYPE TEXT;
