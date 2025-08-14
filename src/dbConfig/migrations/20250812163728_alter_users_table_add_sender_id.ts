import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  
  return knex.schema.alterTable("users", function (table) {
    table.string("sender_id", 255).nullable().unique();
  })
}

export async function down(knex: Knex): Promise<void> {
}

