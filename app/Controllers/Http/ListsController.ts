import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import List from 'App/Models/List'
import ListValidator from 'App/Validators/ListValidator'

export default class ListsController {
  public async index({ view, auth }: HttpContextContract) {
    const user = auth.user!!
    const lists = await user.related('lists').query()
    return view.render('lists/index', { lists })
  }

  public async create({ view }: HttpContextContract) {
    const list = new List()
    return view.render('lists/create', { list })
  }

  public async store({ request, response, auth, session }: HttpContextContract) {
    const data = request.only(['name'])

    await request.validate(ListValidator)

    const user = auth.user
    await List.create({ ...data, userId: user?.id })
    session.flash('notice', 'Lista cadastrada com sucesso.')
    response.redirect().toRoute('lists.index')
  }

  public async edit({ params, view, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    return view.render('lists/edit', { list })
  }

  public async update({ params, request, response, auth, session }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    const data = request.only(['name'])

    await request.validate(ListValidator)

    list.merge(data)
    list.save()
    session.flash('notice', 'Lista atualizada com sucesso.')
    response.redirect().toRoute('lists.index')
  }

  public async destroy({ params, response, auth, session }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    list.delete()
    session.flash('error', 'Lista removida com sucesso.')
    response.redirect().toRoute('lists.index')
  }

  public async share({ params, response, auth, request, session }: HttpContextContract) {
    const list = await this.getList(auth, params.id)
    const userId = request.input('user_id')
    await list.related('sharedWithUsers').attach([userId])
    session.flash('notice', 'Lista compartilhada com sucesso.')
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
