/*
  Warnings:

  - You are about to drop the `SeraphEvent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."SeraphEvent";

-- CreateTable
CREATE TABLE "public"."seraphEvents" (
    "id" UUID NOT NULL,
    "agentId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "spellId" UUID,
    "type" VARCHAR(255) NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seraphEvents_pkey" PRIMARY KEY ("id")
);
