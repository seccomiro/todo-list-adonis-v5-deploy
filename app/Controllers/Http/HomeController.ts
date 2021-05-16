import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  public async index({ view, auth }: HttpContextContract) {
    const user = auth.user
    if (user) {
      const myLists = await user.related('lists').query()
      const listsSharedWithMe = await user
        .related('listsSharedWithMe')
        .query()
        .preload('user')
        .preload('tasks')
      return view.render('home/index', { myLists, listsSharedWithMe })
    }
    return view.render('home/public')
  }
}
