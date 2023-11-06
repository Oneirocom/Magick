import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('agentReleases', function(table) {
    table.boolean('frozen').defaultTo(false).notNullable();
    table.integer('agent_id').unsigned().notNullable(); // Field referencing 'agents' table
    table.foreign('agent_id').references('id').inTable('agentReleases'); // Establishes the foreign key relationship
  })
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('agentReleases', function(table) {
    table.dropColumn('frozen');
  })
}

