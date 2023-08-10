import type { Knex } from 'knex'

exports.up = function (knex: Knex) {
  return knex.schema.alterTable('request', function (table) {
    table.string('agentId').defaultTo('').notNullable()
  })
}

exports.down = function (knex: Knex) {
  return knex.schema.alterTable('request', function (table) {
    table.dropColumn('agentId')
  })
}
