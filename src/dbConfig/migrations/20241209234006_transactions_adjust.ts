import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('transactions');

    return knex.schema.createTable("transactions", function (table) {
        table.increments("id").primary();
        table.string("goal", 255);
        table
          .string("sender", 255)
          .notNullable()
          .references("email")
          .inTable("users")
          .onDelete("CASCADE");
        table.string("transType", 255).notNullable();
        table.string("reference", 255).unique();
        table.integer("target", 255);
        table.integer("startAmount");
        table.string("duration");
        table.timestamps();
    
        table.index(["transType", "sender"], "idx_transType_sender");
        table.index(["sender", "reference"], "idx_sender_ref");
      });
};


export async function down(knex: Knex): Promise<void> {
}

