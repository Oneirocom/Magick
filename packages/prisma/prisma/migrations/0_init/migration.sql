-- CreateTable
CREATE TABLE "content_objects" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_included" BOOLEAN NOT NULL DEFAULT true,
    "document_id" INTEGER NOT NULL,

    CONSTRAINT "content_objects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "is_included" BOOLEAN NOT NULL DEFAULT true,
    "store_id" INTEGER NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents_store" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "documents_store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "entities" (
    "id" SERIAL NOT NULL,
    "dirty" BOOLEAN,
    "enabled" BOOLEAN,
    "updated_at" TEXT,
    "openai_api_key" TEXT,
    "eth_private_key" TEXT,
    "eth_public_address" TEXT,
    "discord_enabled" BOOLEAN,
    "discord_api_key" TEXT,
    "discord_starting_words" TEXT,
    "discord_bot_name_regex" TEXT,
    "discord_bot_name" TEXT,
    "discord_empty_responses" TEXT,
    "discord_spell_handler_incoming" TEXT,
    "use_voice" BOOLEAN,
    "voice_provider" TEXT,
    "voice_character" TEXT,
    "voice_language_code" TEXT,
    "voice_default_phrases" TEXT,
    "tiktalknet_url" TEXT,
    "discord_spell_handler_update" TEXT,
    "twitter_client_enable" BOOLEAN,
    "twitter_token" TEXT,
    "twitter_id" TEXT,
    "twitter_app_token" TEXT,
    "twitter_app_token_secret" TEXT,
    "twitter_access_token" TEXT,
    "twitter_access_token_secret" TEXT,
    "twitter_enable_twits" TEXT,
    "twitter_tweet_rules" TEXT,
    "twitter_auto_tweet_interval_min" TEXT,
    "twitter_auto_tweet_interval_max" TEXT,
    "twitter_bot_name" TEXT,
    "twitter_bot_name_regex" TEXT,
    "twitter_spell_handler_incoming" TEXT,
    "twitter_spell_handler_auto" TEXT,
    "telegram_enabled" BOOLEAN,
    "telegram_bot_token" TEXT,
    "telegram_bot_name" TEXT,
    "telegram_spell_handler_incoming" TEXT,
    "reddit_enabled" BOOLEAN,
    "reddit_app_id" TEXT,
    "reddit_app_secret_id" TEXT,
    "reddit_oauth_token" TEXT,
    "reddit_bot_name" TEXT,
    "reddit_bot_name_regex" TEXT,
    "reddit_spell_handler_incoming" TEXT,
    "zoom_enabled" BOOLEAN,
    "zoom_invitation_link" TEXT,
    "zoom_password" TEXT,
    "zoom_bot_name" TEXT,
    "zoom_spell_handler_incoming" TEXT,
    "loop_enabled" BOOLEAN,
    "loop_interval" TEXT,
    "loop_agent_name" TEXT,
    "loop_spell_handler" TEXT,
    "slack_enabled" BOOLEAN,
    "slack_token" TEXT,
    "slack_signing_secret" TEXT,
    "slack_bot_token" TEXT,
    "slack_bot_name" TEXT,
    "slack_port" TEXT,
    "slack_spell_handler_incoming" TEXT,
    "instagram_enabled" BOOLEAN,
    "instagram_username" TEXT,
    "instagram_password" TEXT,
    "instagram_bot_name" TEXT,
    "instagram_bot_name_regex" TEXT,
    "instagram_spell_handler_incoming" TEXT,
    "messenger_enabled" BOOLEAN,
    "messenger_page_access_token" TEXT,
    "messenger_verify_token" TEXT,
    "messenger_bot_name" TEXT,
    "messenger_bot_name_regex" TEXT,
    "messenger_spell_handler_incoming" TEXT,
    "twilio_enabled" BOOLEAN,
    "twilio_account_sid" TEXT,
    "twilio_auth_token" TEXT,
    "twilio_phone_number" TEXT,
    "twilio_bot_name" TEXT,
    "twilio_empty_responses" TEXT,
    "twilio_spell_handler_incoming" TEXT,

    CONSTRAINT "entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "type" TEXT,
    "agent" TEXT,
    "client" TEXT,
    "speaker" TEXT,
    "channel" TEXT,
    "sender" TEXT,
    "text" TEXT,
    "date" TEXT,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spells" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "graph" JSONB,
    "created_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),
    "modules" JSONB,
    "game_state" JSONB,

    CONSTRAINT "spells_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "spells_name_key" ON "spells"("name");

-- AddForeignKey
ALTER TABLE "content_objects" ADD CONSTRAINT "content_objects_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "documents_store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

