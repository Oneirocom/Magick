import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('spells', (table) => {
    table.dropColumn('hash')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('spells', (table) => {
    table.string('hash')
  })
}
