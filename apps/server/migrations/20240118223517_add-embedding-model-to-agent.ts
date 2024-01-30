import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('agents', (table) => {
    table.string('embedModel').nullable() // Adds a nullable string column
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('agents', (table) => {
    table.dropColumn('embedModel') // Removes the column in the rollback
  })
}
