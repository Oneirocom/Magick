/*
  Warnings:

  - Added the required column `agentId` to the `Memory` table without a default value. This is not possible if the table is not empty.
  - Made the column `channel` on table `Memory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Memory" ADD COLUMN     "agentId" TEXT NOT NULL,
ALTER COLUMN "channel" SET NOT NULL;
