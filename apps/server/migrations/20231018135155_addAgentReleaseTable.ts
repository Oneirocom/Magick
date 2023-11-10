import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('agentReleases', function(table) {
    table.uuid('id').primary(); // Creates a regular id field as primary key, auto-increments
    table.uuid('agent_id').notNullable(); // Field referencing 'agents' table
    table.foreign('agent_id').references('id').inTable('agents'); // Establishes the foreign key relationship
    table.string('version', 255).notNullable(); // String field for version tag
    table.timestamp('createdAt').defaultTo(knex.fn.now()); // 'createdAt' field with the current timestamp
    table.boolean('frozen').defaultTo(false).notNullable();
  });

  return knex.schema.alterTable('agents', function(table) {
    table.uuid('currentReleaseVersionId')
    table.foreign('currentReleaseVersionId').references('id').inTable('agentReleases')
  })

  return knex.schema.alterTable('spells', function(table) {
    table.uuid('currentReleaseVersionId')
    table.foreign('currentReleaseVersionId').references('id').inTable('agentReleases')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('spells', function(table) {
    table.dropForeign('currentReleaseVersionId')
    table.dropColumn('currentReleaseVersionId')
  })
  await knex.schema.alterTable('agents', function(table) {
    table.dropForeign('currentReleaseVersionId')
    table.dropColumn('currentReleaseVersionId')
  })
  return knex.schema.dropTable('agentReleases');
}

