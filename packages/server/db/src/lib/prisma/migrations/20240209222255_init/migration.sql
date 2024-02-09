-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "public"."agent_credentials" (
    "agentId" UUID NOT NULL,
    "credentialId" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_credentials_pkey" PRIMARY KEY ("agentId","credentialId")
);

-- CreateTable
CREATE TABLE "public"."agents" (
    "id" UUID NOT NULL,
    "rootSpell" JSONB,
    "publicVariables" TEXT,
    "secrets" TEXT,
    "name" TEXT,
    "enabled" BOOLEAN,
    "updatedAt" TEXT,
    "pingedAt" TEXT,
    "projectId" TEXT,
    "data" JSONB,
    "runState" TEXT NOT NULL DEFAULT 'stopped',
    "image" TEXT,
    "rootSpellId" UUID,
    "default" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "currentSpellReleaseId" UUID,
    "embedModel" VARCHAR(255),
    "version" VARCHAR(255) NOT NULL DEFAULT '1.0',
    "embeddingProvider" VARCHAR(255),
    "embeddingModel" VARCHAR(255),

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."chatMessages" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "agentId" UUID NOT NULL,
    "sender" VARCHAR(255),
    "connector" VARCHAR(255) NOT NULL,
    "content" TEXT,
    "conversationId" VARCHAR(255),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatMessages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."credentials" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "projectId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "serviceType" VARCHAR(255) NOT NULL,
    "credentialType" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."documents" (
    "id" UUID NOT NULL,
    "type" TEXT,
    "projectId" TEXT,
    "date" TEXT,
    "metadata" JSONB DEFAULT '{}',

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."embeddings" (
    "id" SERIAL NOT NULL,
    "documentId" UUID,
    "content" TEXT,
    "embedding" vector,
    "index" INTEGER,

    CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."events" (
    "id" UUID NOT NULL,
    "type" TEXT,
    "observer" TEXT,
    "sender" TEXT,
    "client" TEXT,
    "channel" TEXT,
    "channelType" TEXT,
    "projectId" TEXT,
    "content" TEXT,
    "agentId" TEXT,
    "entities" TEXT[],
    "embedding" vector,
    "date" TEXT,
    "rawData" TEXT,
    "connector" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."graphEvents" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "agentId" UUID NOT NULL,
    "sender" VARCHAR(255) NOT NULL,
    "connector" VARCHAR(255) NOT NULL,
    "connectorData" JSONB,
    "content" VARCHAR(255) NOT NULL,
    "eventType" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "event" JSONB DEFAULT '{}',
    "observer" VARCHAR(255),

    CONSTRAINT "graphEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."knex_migrations" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255),
    "batch" INTEGER,
    "migration_time" TIMESTAMPTZ(6),

    CONSTRAINT "knex_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."knex_migrations_lock" (
    "index" SERIAL NOT NULL,
    "is_locked" INTEGER,

    CONSTRAINT "knex_migrations_lock_pkey" PRIMARY KEY ("index")
);

-- CreateTable
CREATE TABLE "public"."knowledge" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "sourceUrl" VARCHAR(255),
    "dataType" VARCHAR(255),
    "data" VARCHAR(255),
    "projectId" VARCHAR(255) NOT NULL,
    "metadata" JSON,
    "memoryId" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "knowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."pluginState" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "agentId" UUID,
    "state" JSON,
    "plugin" VARCHAR(255),

    CONSTRAINT "pluginState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."request" (
    "id" UUID NOT NULL,
    "projectId" TEXT NOT NULL,
    "requestData" TEXT,
    "responseData" TEXT,
    "duration" INTEGER NOT NULL,
    "status" TEXT,
    "statusCode" INTEGER,
    "model" TEXT,
    "parameters" TEXT,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "provider" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "processed" BOOLEAN NOT NULL DEFAULT false,
    "cost" DOUBLE PRECISION,
    "spell" TEXT,
    "nodeId" VARCHAR(255),
    "agentId" VARCHAR(255) NOT NULL DEFAULT '',

    CONSTRAINT "request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."spellReleases" (
    "id" UUID NOT NULL,
    "description" VARCHAR(255),
    "agentId" UUID NOT NULL,
    "spellId" UUID,
    "projectId" TEXT,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "spellReleases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."spells" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "projectId" TEXT,
    "graph" JSONB,
    "createdAt" TEXT,
    "updatedAt" TEXT,
    "type" VARCHAR(255),
    "spellReleaseId" UUID,

    CONSTRAINT "spells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tasks" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "eventData" JSON NOT NULL,
    "projectId" TEXT NOT NULL,
    "date" TEXT,
    "steps" TEXT NOT NULL,
    "agentId" TEXT,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "agents_id_key" ON "public"."agents"("id");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_id_key" ON "public"."credentials"("id");

-- CreateIndex
CREATE UNIQUE INDEX "pluginstate_agentid_plugin_unique" ON "public"."pluginState"("agentId", "plugin");

-- AddForeignKey
ALTER TABLE "public"."agent_credentials" ADD CONSTRAINT "agent_credentials_agentid_foreign" FOREIGN KEY ("agentId") REFERENCES "public"."agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."agent_credentials" ADD CONSTRAINT "agent_credentials_credentialid_foreign" FOREIGN KEY ("credentialId") REFERENCES "public"."credentials"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."agents" ADD CONSTRAINT "agents_currentspellreleaseid_foreign" FOREIGN KEY ("currentSpellReleaseId") REFERENCES "public"."spellReleases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chatMessages" ADD CONSTRAINT "chatmessages_agentid_foreign" FOREIGN KEY ("agentId") REFERENCES "public"."agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."graphEvents" ADD CONSTRAINT "graphevents_agentid_foreign" FOREIGN KEY ("agentId") REFERENCES "public"."agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."pluginState" ADD CONSTRAINT "pluginstate_agentid_foreign" FOREIGN KEY ("agentId") REFERENCES "public"."agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."spellReleases" ADD CONSTRAINT "spellreleases_agentid_foreign" FOREIGN KEY ("agentId") REFERENCES "public"."agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."spells" ADD CONSTRAINT "spells_spellreleaseid_foreign" FOREIGN KEY ("spellReleaseId") REFERENCES "public"."spellReleases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
