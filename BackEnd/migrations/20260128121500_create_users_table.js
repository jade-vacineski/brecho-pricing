exports.up = async function up(knex) {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('name', 120).notNullable();
    table.string('email', 160).notNullable().unique();
    table.string('phone', 32).notNullable();
    table.string('password_hash', 255).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = async function down(knex) {
  await knex.schema.dropTableIfExists('users');
};
