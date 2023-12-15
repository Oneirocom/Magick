import type { Knex } from 'knex';

exports.up = function (knex: Knex) {
  return knex.schema.alterTable('chatMessages', function (table) {
    table.renameColumn('coversation_id', 'conversationId');
  });
};

exports.down = function (knex: Knex) {
  return knex.schema.alterTable('chatMessages', function (table) {
    // Revert the change by renaming the column back to its original name
    table.renameColumn('conversationId', 'coversation_id');
  });
};
