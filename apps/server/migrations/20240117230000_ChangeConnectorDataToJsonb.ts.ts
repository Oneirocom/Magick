import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('graphEvents', (table) => {
    table.jsonb('connectorData').alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('graphEvents', (table) => {
    table.string('connectorData').alter()
  })
}
