import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema
    .createTable('users', function (table) {
      table.increments('id').primary();
      table.string('firstName', 255).notNullable();
      table.string('lastName', 255).notNullable();
      table.string('email', 255).unique().notNullable();
      table.string('password', 255).notNullable();
      table.boolean('emailIsVerified').notNullable().defaultTo(false);
      table.integer('balance').notNullable().defaultTo(0);
      table.timestamps();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
    .dropTable('users');
}
