import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('agentReleases', function(table) {
    table.increments('id').primary(); // Creates a regular id field as primary key, auto-increments
    table.integer('agent_id').unsigned().notNullable(); // Field referencing 'agents' table
    table.foreign('agent_id').references('id').inTable('agents'); // Establishes the foreign key relationship
    table.string('version', 255).notNullable(); // String field for version tag
    table.timestamp('createdAt').defaultTo(knex.fn.now()); // 'createdAt' field with the current timestamp
  });
}


export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('agentReleases');
}

