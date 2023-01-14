/*
  Warnings:

  - The `data` column on the `entities` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `graph` column on the `spells` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `modules` column on the `spells` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `gameState` column on the `spells` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "entities" DROP COLUMN "data",
ADD COLUMN     "data" JSONB;

-- AlterTable
ALTER TABLE "spells" DROP COLUMN "graph",
ADD COLUMN     "graph" JSONB,
DROP COLUMN "modules",
ADD COLUMN     "modules" TEXT[],
DROP COLUMN "gameState",
ADD COLUMN     "gameState" JSONB;
