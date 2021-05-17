import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class SettingsController {
  public async index({ view, auth }: HttpContextContract) {
    const themes = ['dark', 'light']
    const setting = await auth.user!!.related('setting').query().first()
    return view.render('settings/index', { themes, setting })
  }

  public async store({ auth, response, request }: HttpContextContract) {
    const data = request.only(['theme'])
    const setting = await auth.user!!.related('setting').query().first()
    if (setting) {
      setting.merge(data)
      await setting.save()
    } else {
      await auth.user!!.related('setting').create(data)
    }
    return response.redirect().toRoute('root')
  }
}
