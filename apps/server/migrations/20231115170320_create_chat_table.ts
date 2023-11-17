import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('chat_messages', (table) => {
    table.uuid('id').primary()
    table.string('connector')
    table.string('agentId').references('id').inTable('agents').notNullable()
    table.string('message').notNullable()
    table.string('sender')
    table.dateTime('createdAt')
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('chat_messages')
}
