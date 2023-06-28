import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('agents', (table) => {
    table.text('image').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('agents', (table) => {
    table.dropColumn('image')
  })
}
