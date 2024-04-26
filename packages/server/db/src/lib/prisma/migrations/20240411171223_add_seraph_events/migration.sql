-- CreateTable
CREATE TABLE "public"."seraphEvents" (
  "id" UUID NOT NULL,
  "agentId" TEXT,
  "projectId" TEXT,
  "spellId" TEXT,
  "type" VARCHAR(255) NOT NULL,
  "data" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "seraphEvents_pkey" PRIMARY KEY ("id")
);
