import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.dropTableIfExists('session');
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("session");
};
