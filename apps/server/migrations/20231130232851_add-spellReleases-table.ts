import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Create 'spell_releases' table
  await knex.schema.createTable('spell_releases', function (table) {
    table.uuid('id').primary()
    table.string('versionName', 255).notNullable()
    table.uuid('agentId').notNullable()
    table.uuid('spellId').nullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.foreign('agentId').references('id').inTable('agents')
  })

  // Alter 'agents' table to include 'createdAt', 'updatedAt', and 'currentSpellReleaseId' fields
  await knex.schema.alterTable('agents', (table) => {
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).alter()
    table.uuid('currentSpellReleaseId')
    table.foreign('currentSpellReleaseId').references('id').inTable('spell_releases')
  })

  // Alter 'spells' table to include 'spellReleaseId' field
  await knex.schema.alterTable('spells', (table) => {
    table.uuid('spellReleaseId').nullable()
    table.foreign('spellReleaseId').references('id').inTable('spell_releases')
  })
}

export async function down(knex: Knex): Promise<void> {
  // Remove foreign key constraints from 'agents' table
  await knex.schema.table('agents', (table) => {
    table.dropForeign(['currentSpellReleaseId'], 'agents_currentspellreleaseid_foreign')
    table.dropColumn('currentSpellReleaseId')
    table.dropColumn('createdAt')
    table.dropColumn('updatedAt')
  })

  // Remove foreign key constraints from 'spells' table
  await knex.schema.table('spells', (table) => {
    table.dropForeign(['spellReleaseId'], 'spells_spellreleaseid_foreign')
    table.dropColumn('spellReleaseId')
  })

  // Now it's safe to drop the 'spell_releases' table
  await knex.schema.dropTable('spell_releases')
}
