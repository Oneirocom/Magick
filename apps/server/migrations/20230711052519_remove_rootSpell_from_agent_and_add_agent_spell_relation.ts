import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    // remove rootSpell from agent
    await knex.schema.table('agents', (table) => {
        // We should stop using it, but i don't want to lose the data
        //table.dropColumn('rootSpell')
        table.uuid('rootSpellId')
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.table('agents', (table) => {
        //table.jsonb('rootSpell')
    })
}

