import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('datasets', (table) => {
    table.integer('id').primary().notNullable().unique()
    table.string('projectId')
    table.string('name')
    // @thomageanderson: jsonb has an upper limit of 255mb
    // we might consider using something like https://spin.atomicobject.com/2019/06/17/knex-postgresql-blobs/
    // but would be more db opinionated so leaving like this for now
    table.jsonb('dataset')
    table.string('openaiFileId')
    // https://knexjs.org/guide/schema-builder.html#timestamps
    table.timestamps(true, true, true)
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('datasets')
}
