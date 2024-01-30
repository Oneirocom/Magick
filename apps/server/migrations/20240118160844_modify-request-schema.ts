import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable('request', (table) => {
    table.string('nodeId').nullable().alter() // Adjust 'string' to match your column type
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable('request', (table) => {
    table.string('nodeId').notNullable().alter() // Revert back to not nullable
  })
}
