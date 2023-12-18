import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('chatMessages', table => {
    // change the content from string to text
    table.text('content').alter();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('chatMessages', table => {
    // change the content from text to string
    table.string('content').alter();
  });
}

