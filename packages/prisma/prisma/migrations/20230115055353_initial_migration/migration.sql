-- CreateTable
CREATE TABLE "content_objects" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_included" BOOLEAN NOT NULL DEFAULT true,
    "document_id" INTEGER NOT NULL,

    CONSTRAINT "content_objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_included" BOOLEAN NOT NULL DEFAULT true,
    "store_id" INTEGER NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_store" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "documents_store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" SERIAL NOT NULL,
    "dirty" BOOLEAN,
    "enabled" BOOLEAN,
    "updated_at" TEXT,
    "data" JSONB,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "observer" TEXT,
    "sender" TEXT,
    "entities" JSONB,
    "client" TEXT,
    "channel" TEXT,
    "channelType" TEXT,
    "content" TEXT,
    "agentId" INTEGER NOT NULL,
    "date" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spells" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "graph" JSONB,
    "created_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "modules" TEXT[],
    "gameState" JSONB,

    CONSTRAINT "spells_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_agentsTospells" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "spells_id_key" ON "spells"("id");

-- CreateIndex
CREATE UNIQUE INDEX "spells_name_key" ON "spells"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_agentsTospells_AB_unique" ON "_agentsTospells"("A", "B");

-- CreateIndex
CREATE INDEX "_agentsTospells_B_index" ON "_agentsTospells"("B");

-- AddForeignKey
ALTER TABLE "content_objects" ADD CONSTRAINT "content_objects_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "documents_store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_agentsTospells" ADD CONSTRAINT "_agentsTospells_A_fkey" FOREIGN KEY ("A") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_agentsTospells" ADD CONSTRAINT "_agentsTospells_B_fkey" FOREIGN KEY ("B") REFERENCES "spells"("id") ON DELETE CASCADE ON UPDATE CASCADE;
