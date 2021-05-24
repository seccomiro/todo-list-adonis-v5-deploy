import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SettingValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    theme: schema.enum(['dark', 'light']),
  })

  public messages = {
    'theme.enum': 'Selecione o valor dark ou light',
  }
}
