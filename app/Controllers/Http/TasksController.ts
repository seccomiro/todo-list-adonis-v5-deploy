import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import List from 'App/Models/List'
import Task from 'App/Models/Task'

export default class TasksController {
  public async index({ view, auth, params }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const tasks = await this.getTasks(auth, params)
    return view.render('tasks/index', { tasks, list })
  }

  public async show({ params, view, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const task = await this.getTask(auth, params)
    return view.render('tasks/show', { task, list })
  }

  public async create({ view, auth, params }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    return view.render('tasks/create', { list })
  }

  public async store({ request, response, auth, params }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const data = request.only(['title'])
    await list.related('tasks').create(data)
    response.redirect().toRoute('lists.tasks.index', { list_id: list.id })
  }

  public async done({ params, response, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const task = await this.getTask(auth, params)
    task.done = !task.done
    task.save()
    response.redirect().toRoute('lists.tasks.index', { list_id: list.id })
  }

  public async edit({ params, view, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const task = await this.getTask(auth, params)
    return view.render('tasks/edit', { task, list })
  }

  public async update({ params, request, response, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const task = await this.getTask(auth, params)
    const data = request.only(['title', 'description'])
    task.merge(data)
    task.save()
    response.redirect().toRoute('lists.tasks.index', { list_id: list.id })
  }

  public async destroy({ params, response, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const task = await this.getTask(auth, params)
    task.delete()
    response.redirect().toRoute('lists.tasks.index', { list_id: list.id })
  }

  private async getTasks(auth: AuthContract, params): Promise<Task[]> {
    const user = auth.user!!
    return await user.related('tasks').query().where('tasks.list_id', params.list_id)
  }

  private async getTask(auth: AuthContract, params): Promise<Task> {
    const user = auth.user!!
    return await user
      .related('tasks')
      .query()
      .where('tasks.id', params.id)
      .where('tasks.list_id', params.list_id)
      .firstOrFail()
  }

  private async getList(auth: AuthContract, id): Promise<List> {
    const user = auth.user!!
    return await user.related('lists').query().where('id', id).firstOrFail()
  }
}
