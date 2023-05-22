import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // create a tasks table
  await knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary()
    table.text('status').notNullable()
    table.text('type').notNullable()
    table.text('objective').notNullable()
    table.json('eventData').notNullable()
    table.text('projectId').notNullable()
    table.text('date')
    table.text('steps').notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tasks')
}
