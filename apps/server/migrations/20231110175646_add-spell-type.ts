import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('spells', (table) => {
    table.string('type').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('spells', (table) => {
    table.dropColumn('type')
  })
}
