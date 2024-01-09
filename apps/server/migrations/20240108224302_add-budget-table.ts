import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('budgets', function (table) {
    table.increments('id').primary()
    table.string('agent_id')
    table.decimal('total_budget', 14, 2)
    table.decimal('current_cost', 14, 2).defaultTo(0)
    table.enum('duration', ['daily', 'weekly', 'monthly', 'yearly'])
    table.timestamp('created_at').defaultTo(knex.fn.now())
    table.timestamp('updated_at').defaultTo(knex.fn.now())
    table.date('reset_date')
    table.enum('status', ['active', 'paused', 'expired'])
    table.timestamp('reset_at')
    table.decimal('alert_threshold', 14, 2)
    table.timestamp('alerted_at')
    table.enum('alert_frequency', ['once', 'daily', 'weekly', 'monthly']).defaultTo('daily')
    table.text('notes')
  })
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('budgets')
}
