-- DropForeignKey
ALTER TABLE "public"."agent_credentials" DROP CONSTRAINT "agent_credentials_agentid_foreign";

-- DropForeignKey
ALTER TABLE "public"."agent_credentials" DROP CONSTRAINT "agent_credentials_credentialid_foreign";

-- AddForeignKey
ALTER TABLE "public"."agent_credentials" ADD CONSTRAINT "agent_credentials_agentid_foreign" FOREIGN KEY ("agentId") REFERENCES "public"."agents"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."agent_credentials" ADD CONSTRAINT "agent_credentials_credentialid_foreign" FOREIGN KEY ("credentialId") REFERENCES "public"."credentials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
