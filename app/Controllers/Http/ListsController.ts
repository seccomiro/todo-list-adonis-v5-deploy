import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import List from 'App/Models/List'

export default class ListsController {
  public async index({ view }: HttpContextContract) {
    const lists = await List.all()
    return view.render('lists/index', { lists })
  }

  public async show({ params, view }: HttpContextContract) {
    const list = await List.find(params.id)
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

  public async edit({ params, view }: HttpContextContract) {
    const list = await List.find(params.id)
    return view.render('lists/edit', { list })
  }

  public async update({ params, request, response }: HttpContextContract) {
    const list = await List.findOrFail(params.id)
    const data = request.only(['name'])
    list.merge(data)
    list.save()
    response.redirect().toRoute('lists.index')
  }

  public async destroy({ params, response }: HttpContextContract) {
    const list = await List.findOrFail(params.id)
    list.delete()
    response.redirect().toRoute('lists.index')
  }
}
