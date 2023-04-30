import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // create a tasks table
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary()
    table.string('status').notNullable()
    table.string('type')
    table.string('objective').notNullable()
    table.json('eventData').notNullable()
    table.string('projectId').notNullable()
    table.string('date')
    table.json('steps').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tasks')
}
