import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import List from 'App/Models/List'

export default class ListsController {
  public async index({ view, auth }: HttpContextContract) {
    const user = auth.user!!
    const lists = await user.related('lists').query()
    return view.render('lists/index', { lists })
  }

  public async show({ params, view, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    return view.render('lists/show', { list })
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

  private async getList(auth: AuthContract, id): Promise<List> {
    const user = auth.user!!
    return await user.related('lists').query().where('id', id).firstOrFail()
  }
}