-- AlterTable
ALTER TABLE "public"."pluginState" ADD COLUMN     "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP;
