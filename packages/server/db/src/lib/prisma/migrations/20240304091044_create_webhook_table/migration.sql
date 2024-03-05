-- CreateEnum
CREATE TYPE "public"."WebhookMethod" AS ENUM ('GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD', 'CONNECT', 'TRACE');

-- CreateEnum
CREATE TYPE "public"."WebhookStatus" AS ENUM ('ACTIVE', 'REJECTED', 'SUCCESS', 'FAILURE');

-- CreateTable
CREATE TABLE "public"."Webhook" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "agentId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "method" "public"."WebhookMethod" NOT NULL,
    "headers" JSONB,
    "body" JSONB,
    "response" JSONB,
    "status" "public"."WebhookStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Webhook_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Webhook" ADD CONSTRAINT "webhook_agentid_foreign" FOREIGN KEY ("agentId") REFERENCES "public"."agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
