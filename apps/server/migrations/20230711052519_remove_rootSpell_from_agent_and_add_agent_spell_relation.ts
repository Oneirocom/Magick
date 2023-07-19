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
    await knex.raw(`
        CREATE TRIGGER agent_updated AFTER UPDATE ON agents
        FOR EACH ROW
        WHEN(
            (old.enabled is distinct from new.enabled) OR
            (old."rootSpellId" is distinct from new."rootSpellId")
        )
        EXECUTE PROCEDURE notify_agent_updated();
    `)
}


export async function down(knex: Knex): Promise<void> {
    await knex.raw(`DROP TRIGGER IF EXISTS agent_updated ON agents`)
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

