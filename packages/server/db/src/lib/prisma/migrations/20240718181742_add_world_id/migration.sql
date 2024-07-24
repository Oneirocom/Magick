-- AlterTable
ALTER TABLE "public"."agents" ADD COLUMN     "worldId" TEXT;

-- AlterTable
ALTER TABLE "public"."credentials" ADD COLUMN     "worldId" VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."events" ADD COLUMN     "worldId" TEXT;

-- AlterTable
ALTER TABLE "public"."knowledge" ADD COLUMN     "worldId" VARCHAR(255);

-- AlterTable
ALTER TABLE "public"."request" ADD COLUMN     "worldId" TEXT;

-- AlterTable
ALTER TABLE "public"."seraphEvents" ADD COLUMN     "worldId" UUID;

-- AlterTable
ALTER TABLE "public"."spellReleases" ADD COLUMN     "worldId" TEXT;

-- AlterTable
ALTER TABLE "public"."spells" ADD COLUMN     "worldId" TEXT;

-- AlterTable
ALTER TABLE "public"."tasks" ADD COLUMN     "worldId" TEXT;
