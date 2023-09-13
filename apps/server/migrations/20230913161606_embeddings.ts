import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('embeddings', (table) => {
    table.increments('id').primary()
    table.string('documentId').notNullable()
    table.text('content').notNullable()
    table.specificType('embedding', 'vector(1536)')
    table.integer('index')
  })

  await knex
    .insert(
      knex
        .select(
          knex.raw(`content, embedding, COALESCE(metadata->>'elementNumber', 0) as index, id as documentId`)
        )
        .from('documents')
    )
    .into('embeddings')

  await knex.schema.alterTable('documents', (table) => {
    table.dropColumn('content')
    table.dropColumn('embedding')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('documents', (table) => {
    table.text('content')
    table.specificType('embedding', 'vector(1536)')
  })

  await knex.schema.dropTable('embeddings')
}
