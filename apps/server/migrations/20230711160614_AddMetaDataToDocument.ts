import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('documents', (table) => {
    table.jsonb('metadata').defaultTo('{}')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('documents', (table) => {
    table.dropColumn('metadata')
  })
}
