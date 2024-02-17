-- DropForeignKey
ALTER TABLE "public"."agents" DROP CONSTRAINT "agents_currentspellreleaseid_foreign";

-- DropForeignKey
ALTER TABLE "public"."chatMessages" DROP CONSTRAINT "chatmessages_agentid_foreign";

-- DropForeignKey
ALTER TABLE "public"."graphEvents" DROP CONSTRAINT "graphevents_agentid_foreign";

-- DropForeignKey
ALTER TABLE "public"."spellReleases" DROP CONSTRAINT "spellreleases_agentid_foreign";

-- DropForeignKey
ALTER TABLE "public"."spells" DROP CONSTRAINT "spells_spellreleaseid_foreign";

-- AddForeignKey
ALTER TABLE "public"."agents" ADD CONSTRAINT "agents_currentspellreleaseid_foreign" FOREIGN KEY ("currentSpellReleaseId") REFERENCES "public"."spellReleases"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."chatMessages" ADD CONSTRAINT "chatmessages_agentid_foreign" FOREIGN KEY ("agentId") REFERENCES "public"."agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."graphEvents" ADD CONSTRAINT "graphevents_agentid_foreign" FOREIGN KEY ("agentId") REFERENCES "public"."agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."spellReleases" ADD CONSTRAINT "spellreleases_agentid_foreign" FOREIGN KEY ("agentId") REFERENCES "public"."agents"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."spells" ADD CONSTRAINT "spells_spellreleaseid_foreign" FOREIGN KEY ("spellReleaseId") REFERENCES "public"."spellReleases"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
