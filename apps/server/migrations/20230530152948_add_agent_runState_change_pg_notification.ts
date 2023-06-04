import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    // Adds postgres notification to agents table.
    // This will be used to notify the agent manager when an agent's enabled column changes.
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
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`
        DROP FUNCTION notify_agent_updated();
    `)
    await knex.raw(`
        DROP TRIGGER agent_updated ON agents;
    `)
}
