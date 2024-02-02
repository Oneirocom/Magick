import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.table('agents', (table) => {
    table.string('embeddingProvider').nullable()
    table.string('embeddingModel').nullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('agents', (table) => {
    table.dropColumn('embeddingProvider')
    table.dropColumn('embeddingModel')
  })
}
