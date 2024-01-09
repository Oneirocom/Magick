import { Knex } from 'knex'

// Up migration
export async function up(knex: Knex): Promise<void> {
  // Modify 'sender' column to be nullable
  await knex.schema.alterTable('chatMessages', (table) => {
    table.string('sender').nullable().alter()
  })
}

// Down migration
export async function down(knex: Knex): Promise<void> {
  // Revert 'sender' column to be not nullable
  await knex.schema.alterTable('chatMessages', (table) => {
    table.string('sender').notNullable().alter()
  })
}
