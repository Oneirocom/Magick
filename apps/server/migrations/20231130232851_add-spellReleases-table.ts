import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Create 'spellReleases' table
  await knex.schema.createTable('spellReleases', function (table) {
    table.uuid('id').primary()
    table.uuid('spellId').notNullable()
    table.string('versionName', 255).notNullable()
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.foreign('spellId').references('id').inTable('spells').onDelete('CASCADE')
  })

  // Alter 'agents' table to include 'createdAt', 'updatedAt', and 'currentSpellReleaseId' fields
  await knex.schema.alterTable('agents', (table) => {
    table.timestamp('createdAt').defaultTo(knex.fn.now())
    table.timestamp('updatedAt').defaultTo(knex.fn.now()).alter()
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
  // Drop 'spellReleases' table
  await knex.schema.dropTable('spellReleases')

  // Drop 'createdAt' and 'currentSpellReleaseId' fields from 'agents' table
  await knex.schema.alterTable('agents', (table) => {
    table.dropColumn('createdAt')
    table.dropColumn('currentSpellReleaseId')
  })

  // Drop 'spellReleaseId' field from 'spells' table
  await knex.schema.alterTable('spells', (table) => {
    table.dropColumn('spellReleaseId')
  })
}
