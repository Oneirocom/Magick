import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('graphEvents', (table) => {
    table.string('observer').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('graphEvents', (table) => {
    table.dropColumn('observer')
  })
}
