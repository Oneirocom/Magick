import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('spells', (table) => {
    table.text('name').alter()
    table.text('projectId').alter()
    table.text('hash').alter()
    table.text('createdAt').alter()
    table.text('updatedAt').alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('spells', (table) => {
    table.string('name').alter()
    table.string('projectId').alter()
    table.string('hash').alter()
    table.string('createdAt').alter()
    table.string('updatedAt').alter()
  })
}
