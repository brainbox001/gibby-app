import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('session', function (table) {
      table.increments('id').primary();
      table.string('email', 255).unique().notNullable();
      table.string('uuid', 255).notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('session');
}
