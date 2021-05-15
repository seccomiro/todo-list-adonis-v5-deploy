import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ListUser extends BaseSchema {
  protected tableName = 'list_user'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users')
      table.integer('list_id').unsigned().notNullable().references('id').inTable('lists')
      table.timestamps(true)
      table.primary(['user_id', 'list_id'])
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
