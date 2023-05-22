import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('documents', (table) => {
    table.text('type').alter()
    table.text('projectId').alter()
    table.text('date').alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('documents', (table) => {
    table.string('type').alter()
    table.string('projectId').alter()
    table.string('date').alter()
  })
}
