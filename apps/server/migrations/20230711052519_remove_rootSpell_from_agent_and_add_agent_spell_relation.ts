import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    // remove rootSpell from agent
    await knex.schema.table('agents', (table) => {
        // We should stop using it, but i don't want to lose the data
        //table.dropColumn('rootSpell')
        table.uuid('rootSpellId')
    })
    await knex.raw(`UPDATE agents SET "rootSpellId" = ("rootSpell" ->> 'id')::uuid`)
    await knex.raw(`DROP TRIGGER IF EXISTS agent_updated ON agents`)

    // change agent_updated trigger to include enabledChanged
    await knex.raw(`
        CREATE OR REPLACE FUNCTION notify_agent_updated() RETURNS TRIGGER AS $$
        DECLARE
        payload JSON;
        enabled_changed BOOLEAN;
        BEGIN
            enabled_changed = (NEW.enabled IS DISTINCT FROM OLD.enabled);
            payload = json_build_object(
            'id', NEW.id,
            'eventName', 'agent:updated',
            'enabled', NEW.enabled,
            'enabledChanged', enabled_changed,
            'runState', NEW."runState",
            'updatedAt', NEW."updatedAt"
            );
            PERFORM pg_notify('agents', payload::text);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql
    `)
    await knex.raw(`
        CREATE TRIGGER agent_updated AFTER UPDATE ON agents
        FOR EACH ROW
        WHEN(
            (old.enabled is distinct from new.enabled) OR
            (old."rootSpellId" is distinct from new."rootSpellId")
        )
        EXECUTE PROCEDURE notify_agent_updated();
    `)

    // add new trigger for when an agent is deleted
    await knex.raw(`
        CREATE OR REPLACE FUNCTION notify_agent_deleted() RETURNS TRIGGER AS $$
        DECLARE
        payload JSON;
        BEGIN
            payload = json_build_object(
            'id', OLD.id,
            'eventName', 'agent:deleted'
            );
            PERFORM pg_notify('agents', payload::text);
            RETURN OLD;
        END;
        $$ LANGUAGE plpgsql
    `)
    await knex.raw(`
        CREATE OR REPLACE TRIGGER agent_deleted AFTER DELETE ON agents
        FOR EACH ROW
        EXECUTE PROCEDURE notify_agent_deleted();
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TRIGGER IF EXISTS agent_deleted ON agents`);
    await knex.raw(`DROP FUNCTION IF EXISTS notify_agent_deleted() CASCADE`)
    await knex.raw(`DROP TRIGGER IF EXISTS agent_updated ON agents`)
    await knex.raw(`
        CREATE OR REPLACE FUNCTION notify_agent_updated() RETURNS TRIGGER AS $$
        DECLARE
            payload JSON;
        BEGIN
            payload = json_build_object(
                'id', NEW.id,
                'eventName', 'agent:updated',
                'enabled', NEW.enabled,
                'runState', NEW."runState",
                'updatedAt', NEW."updatedAt"
            );
            PERFORM pg_notify('agents', payload::text);
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
    `)
    await knex.raw(`
        CREATE TRIGGER agent_updated AFTER UPDATE ON agents
        FOR EACH ROW
        WHEN(old.enabled is distinct from new.enabled)
        EXECUTE PROCEDURE notify_agent_updated();
    `)
    await knex.schema.table('agents', (table) => {
        table.dropColumn("rootSpellId")
    })
}

