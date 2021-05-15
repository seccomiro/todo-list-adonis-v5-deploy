import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tasks extends BaseSchema {
  protected tableName = 'tasks'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.integer('list_id').unsigned().notNullable().references('id').inTable('lists')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('list_id')
    })
  }
}
