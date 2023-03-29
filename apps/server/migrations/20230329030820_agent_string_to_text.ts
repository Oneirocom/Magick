import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('agents', (table) => {
    table.text('publicVariables').alter()
    table.text('secrets').alter()
    table.text('name').alter()
    table.text('updatedAt').alter()
    table.text('pingedAt').alter()
    table.text('projectId').alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('agents', (table) => {
    table.string('publicVariables').alter()
    table.string('secrets').alter()
    table.string('name').alter()
    table.string('updatedAt').alter()
    table.string('pingedAt').alter()
    table.string('projectId').alter()
  })
}
