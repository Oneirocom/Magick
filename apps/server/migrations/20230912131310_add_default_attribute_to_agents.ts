import type { Knex } from 'knex'

exports.up = function (knex: Knex) {
  return knex.schema.alterTable('agents', function (table) {
    table.boolean('default').defaultTo(false).notNullable()
  })
}

exports.down = function (knex: Knex) {
  return knex.schema.alterTable('agents', function (table) {
    table.dropColumn('default')
  })
}
