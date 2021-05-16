import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import List from 'App/Models/List'

export default class ListsController {
  public async index({ view, auth }: HttpContextContract) {
    const user = auth.user!!
    const lists = await user.related('lists').query()
    return view.render('lists/index', { lists })
  }

  public async create({ view }: HttpContextContract) {
    return view.render('lists/create')
  }

  public async store({ request, response, auth }: HttpContextContract) {
    const data = request.only(['name'])
    const user = auth.user
    await List.create({ ...data, userId: user?.id })
    response.redirect().toRoute('lists.index')
  }

  public async edit({ params, view, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    return view.render('lists/edit', { list })
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    const data = request.only(['name'])
    list.merge(data)
    list.save()
    response.redirect().toRoute('lists.index')
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    list.delete()
    response.redirect().toRoute('lists.index')
  }

  public async share({ params, response, auth, request }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    const userId = request.input('user_id')
    await list.related('sharedWithUsers').attach([userId])
    response.redirect().toRoute('lists.tasks.index', { list_id: list.id })
  }

  private async getList(auth: AuthContract, id, preload = false): Promise<List> {
    const user = auth.user!!
    if (preload) {
      return await user.related('lists').query().where('id', id).preload('tasks').firstOrFail()
    } else {
      return await user.related('lists').query().where('id', id).firstOrFail()
    }
  }
}
