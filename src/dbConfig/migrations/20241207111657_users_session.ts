import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('session');
  
  return knex.schema.createTable("session", function (table) {
    table.increments("id").primary();
    table
      .string("email", 255)
      .unique()
      .notNullable()
      .references("email")
      .inTable("users")
      .onDelete('CASCADE')
    table.string("uuid", 255).notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("session");
};

