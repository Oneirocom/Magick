-- CreateTable
CREATE TABLE "public"."agent_channels" (
    "id" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "channelKey" TEXT NOT NULL,
    "channelName" TEXT NOT NULL,
    "initialEvent" JSONB NOT NULL,
    "channelActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_channels_pkey" PRIMARY KEY ("id")
);
