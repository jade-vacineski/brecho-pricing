exports.up = async function up(knex) {
  await knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.string('name', 160).notNullable();
    table.text('description').notNullable();
    table.string('brand', 120);
    table.string('category', 40);
    table.string('condition', 40);
    table.string('gender', 40);
    table.decimal('base_price', 10, 2).notNullable();
    table.decimal('suggested_price', 10, 2).notNullable();
    table.text('ai_rationale');
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('items');
};
