exports.up = async function up(knex) {
  const hasAiRationale = await knex.schema.hasColumn('items', 'ai_rationale');
  if (!hasAiRationale) {
    await knex.schema.alterTable('items', (table) => {
      table.text('ai_rationale');
    });
  }
};

exports.down = async function down(knex) {
  const hasAiRationale = await knex.schema.hasColumn('items', 'ai_rationale');
  if (hasAiRationale) {
    await knex.schema.alterTable('items', (table) => {
      table.dropColumn('ai_rationale');
    });
  }
};
