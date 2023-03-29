import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('events', (table) => {
    table.text('type').alter()
    table.text('observer').alter()
    table.text('sender').alter()
    table.text('client').alter()
    table.text('channel').alter()
    table.text('channelType').alter()
    table.text('projectId').alter()
    table.text('agentId').alter()
    table.text('date').alter()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('events', (table) => {
    table.string('type').alter()
    table.string('observer').alter()
    table.string('sender').alter()
    table.string('client').alter()
    table.string('channel').alter()
    table.string('channelType').alter()
    table.string('projectId').alter()
    table.string('agentId').alter()
    table.string('date').alter()
  })
}
