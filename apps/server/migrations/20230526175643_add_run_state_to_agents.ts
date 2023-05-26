import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable('agents', table => {
        table.enum('run_state', ['running', 'stopped', 'paused', 'failed', 'starting']).defaultTo('stopped').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.alterTable('agents', table => {
        table.dropColumn('run_state')
    })
}

