import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Create 'spellReleases' table
  await knex.schema.createTable('spellReleases', function (table) {
    table.uuid('id').primary()
    table.string('description').nullable()
    table.uuid('agentId').notNullable()
    table.uuid('spellId').nullable()
    table.text('projectId').nullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.foreign('agentId').references('id').inTable('agents')
  })

  // Alter 'agents' table to include 'createdAt', 'updatedAt', and 'currentSpellReleaseId' fields
  await knex.schema.alterTable('agents', (table) => {
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.uuid('currentSpellReleaseId')
    table.foreign('currentSpellReleaseId').references('id').inTable('spellReleases')
  })

  // Alter 'spells' table to include 'spellReleaseId' field
  await knex.schema.alterTable('spells', (table) => {
    table.uuid('spellReleaseId').nullable()
    table.foreign('spellReleaseId').references('id').inTable('spellReleases')
  })
}

export async function down(knex: Knex): Promise<void> {
  // Remove foreign key constraints and columns from 'agents' table
  await knex.schema.table('agents', (table) => {
    table.dropForeign(['currentSpellReleaseId'])
    table.dropColumn('currentSpellReleaseId')
    if (knex.schema.hasColumn('agents', 'createdAt')) {
      table.dropColumn('createdAt')
    }
  })

  // Remove foreign key constraints and column from 'spells' table
  await knex.schema.table('spells', (table) => {
    table.dropForeign(['spellReleaseId'])
    table.dropColumn('spellReleaseId')
  })

  // Drop the 'spellReleases' table
  await knex.schema.dropTableIfExists('spellReleases')
}
