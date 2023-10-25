import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    table.boolean('frozen').defaultTo(false).notNullable();
}


export async function down(knex: Knex): Promise<void> {
  table.dropColumn('frozen');
}

