import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('chatMessages', (table) => {
    table.uuid('id').primary();
    table.string('message').notNullable();
    table.uuid('agent_id').unsigned().notNullable();
    table.foreign('agent_id').references('id').inTable('agents');
    table.string('sender').notNullable();
    table.string('connector').notNullable();
    table.string('content').notNullable();
    table.string('coversation_id').notNullable();
    table.timestamps(true, true);
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('chatMessages');
}

