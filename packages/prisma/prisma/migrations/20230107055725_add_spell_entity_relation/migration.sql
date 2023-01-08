-- CreateTable
CREATE TABLE "_entitiesTospells" (
    "A" INTEGER NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_entitiesTospells_AB_unique" ON "_entitiesTospells"("A", "B");

-- CreateIndex
CREATE INDEX "_entitiesTospells_B_index" ON "_entitiesTospells"("B");

-- AddForeignKey
ALTER TABLE "_entitiesTospells" ADD CONSTRAINT "_entitiesTospells_A_fkey" FOREIGN KEY ("A") REFERENCES "entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_entitiesTospells" ADD CONSTRAINT "_entitiesTospells_B_fkey" FOREIGN KEY ("B") REFERENCES "spells"("id") ON DELETE CASCADE ON UPDATE CASCADE;
