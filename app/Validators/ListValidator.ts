import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ListValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    name: schema.string({}, [rules.minLength(3), rules.maxLength(10)]),
  })

  public messages = {
    'required': 'Campo obrigatório',
    'name.minLength': 'O valor deve ter ao menos 3 caracteres',
    'name.maxLength': 'O valor deve no máximo 10 caracteres',
  }
}
