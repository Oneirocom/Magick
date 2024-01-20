import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  // Step 1: Add the 'version' column with a default value of '1.0'
  await knex.schema.table('agents', (table) => {
    table.string('version').defaultTo('1.0').notNullable()
  })

  // Optional Step 2: Explicitly set 'version' to '1.0' for existing rows
  // Uncomment the next line if your DB doesn't set defaults for existing rows
  await knex('agents').update({ version: '1.0' })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.table('agents', (table) => {
    table.dropColumn('version')
  })
}
