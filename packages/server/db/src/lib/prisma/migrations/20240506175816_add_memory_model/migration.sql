/*
  Warnings:

  - You are about to drop the `seraphEvents` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "public"."seraphEvents";

-- CreateTable
CREATE TABLE "public"."SeraphEvent" (
    "id" UUID NOT NULL,
    "agentId" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "spellId" UUID,
    "type" VARCHAR(255) NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SeraphEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Memory" (
    "id" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT,
    "event" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "vector" vector,

    CONSTRAINT "Memory_pkey" PRIMARY KEY ("id")
);
