import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import List from 'App/Models/List'
import Task from 'App/Models/Task'
import User from 'App/Models/User'

export default class TasksController {
  public async index({ view, auth, params }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const tasks = await this.getTasks(auth, params)
    const usersToShare = await User.query().where('id', '<>', auth.user!!.id)
    return view.render('tasks/index', { tasks, list, usersToShare })
  }

  public async show({ params, view, auth }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const task = await this.getTask(auth, params)
    return view.render('tasks/show', { task, list })
  }

  public async create({ view, auth, params }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const task = new Task()
    return view.render('tasks/create', { list, task })
  }

  public async store({ request, response, auth, params, session }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const data = request.only(['title'])

    if (!this.validate(data, session)) {
      return response.redirect().back()
    }

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

  public async update({ params, request, response, auth, session }: HttpContextContract) {
    const list = await this.getList(auth, params.list_id)
    const task = await this.getTask(auth, params)
    const data = request.only(['title', 'description'])

    if (!this.validate(data, session)) {
      return response.redirect().back()
    }

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

  private validate(data, session): Boolean {
    const errors = {}

    if (!data.title) {
      this.registerError(errors, 'title', 'Campo obrigatório')
    } else {
      if (data.title.length < 3) {
        this.registerError(errors, 'title', 'Nome precisa ter pelo menos 3 caracteres')
      }

      if (data.title.length > 10) {
        this.registerError(errors, 'title', 'Nome precisa ter no máximo 10 caracteres')
      }
    }

    if (data.description === data.title) {
      this.registerError(errors, 'description', 'Descrição não pode ser igual ao título')
    }

    if (Object.entries(errors).length > 0) {
      session.flash('error', 'Erro ao salvar a lista.')
      session.flash('errors', errors)
      session.flashAll()
      return false
    }

    return true
  }

  private registerError(errors, attribute, error) {
    if (!errors[attribute]) {
      errors[attribute] = []
    }
    errors[attribute].push(error)
  }
}
