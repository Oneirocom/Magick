import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('embeddings', (table) => {
    table.increments('id').primary()
    table.uuid('documentId')
    table.text('content')
    table.specificType('embedding', 'vector(1536)')
    table.integer('index')
  })

  await knex
    .from(knex.raw('?? (??, ??, ??, ??)', ['embeddings', 'documentId', 'content', 'embedding', 'index']))
    .insert(
      knex
        .select(
          knex.raw(
            `id as documentId, content, embedding, COALESCE(CAST(metadata->>'elementNumber' AS INTEGER), 0) as index`
          )
        )
        .from('documents')
    )

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

  await knex.from('documents').update({
    content: knex('embeddings')
      .select('content')
      .where('documentId', knex.raw('??', ['documents.id']))
      .limit(1)
  })

  await knex.from('documents').update({
    embedding: knex('embeddings')
      .select('embedding')
      .where('documentId', knex.raw('??', ['documents.id']))
      .limit(1)
  })

  await knex.schema.dropTable('embeddings')
}
