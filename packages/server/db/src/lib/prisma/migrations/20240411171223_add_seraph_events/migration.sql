-- CreateTable
CREATE TABLE "public"."seraphEvents" (
  "id" UUID NOT NULL,
  "agentId" UUID NOT NULL,
  "projectId" VARCHAR(255) NOT NULL,
  "spellId" VARCHAR(255),
  "type" VARCHAR(255) NOT NULL,
  "data" JSONB NOT NULL,
  "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "seraphEvents_pkey" PRIMARY KEY ("id")
);
