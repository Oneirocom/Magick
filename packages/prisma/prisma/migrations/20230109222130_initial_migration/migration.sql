-- CreateTable
CREATE TABLE "content_objects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_included" BOOLEAN NOT NULL DEFAULT true,
    "document_id" INTEGER NOT NULL,
    CONSTRAINT "content_objects_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documents" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_included" BOOLEAN NOT NULL DEFAULT true,
    "store_id" INTEGER NOT NULL,
    CONSTRAINT "documents_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "documents_store" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "documents_store" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "entities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dirty" BOOLEAN,
    "enabled" BOOLEAN,
    "updated_at" TEXT,
    "data" TEXT
);

-- CreateTable
CREATE TABLE "events" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT,
    "speaker" TEXT,
    "agent" TEXT,
    "client" TEXT,
    "channel" TEXT,
    "sender" TEXT,
    "text" TEXT,
    "date" TEXT
);

-- CreateTable
CREATE TABLE "spells" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "graph" TEXT,
    "created_at" DATETIME,
    "updated_at" DATETIME,
    "deleted_at" DATETIME,
    "modules" TEXT,
    "gameState" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "spells_id_key" ON "spells"("id");

-- CreateIndex
CREATE UNIQUE INDEX "spells_name_key" ON "spells"("name");
