import { action, computed, observable } from 'mobx'

import db from '../db'
import { IGroup, IGroupAttributes, ITaskAttributes } from '../models'
import { addOne, removeById, renew, reorder, reorderBetween } from './adapter'

export default class TaskStore {

  @observable public groups: IGroup[] = []

  @observable public selectedId: number | null = null

  @computed
  public get selectedTask () {
    const id = this.selectedId

    if (id) {
      const groups = this.groups
      const length = groups.length

      for (let i = 0; i < length; i++) {
        const task = groups[i].tasks.find((t) => t.id === id)
        if (task) return task
      }
    }

    return null
  }

  @action
  public async listGroup (boardId: number) {
    this.groups = await db.listGroups(boardId)
  }

  @action
  public async addGroup (boardId: number, title: string) {
    const group = await db.addGroup(boardId, title)
    this.groups = addOne(this.groups, group)
  }

  @action
  public async updateGroup (
    groupId: number,
    groupAttrs: Partial<IGroupAttributes>,
  ) {
    const group = await db.updateGroup(groupId, groupAttrs)
    this.groups = renew(this.groups, group)
  }

  @action
  public async moveGroup (
    boardId: number,
    fromIndex: number,
    toIndex: number,
  ) {
    await db.moveGroup(boardId, fromIndex, toIndex)
    this.groups = reorder(this.groups, fromIndex, toIndex)
  }

  @action
  public async removeGroup (groupId: number) {
    await db.removeGroup(groupId)
    this.groups = removeById(this.groups, groupId)
  }

  @action
  public async addTask (
    groupId: number,
    content: string,
    contentHtml: string,
    dueAt: number, tagIds: number[],
  ) {
    const task = await db.addTask(
      groupId, content, contentHtml, dueAt, tagIds,
    )

    this.groups = this.groups.map((group) => (
      group.id === task.groupId
        ? { ...group, tasks: addOne(group.tasks, task) }
        : group
    ))
  }

  @action
  public async updateTask (
    taskId: number,
    taskAttrs: Partial<ITaskAttributes>,
  ) {
    const task = await db.updateTask(taskId, taskAttrs)

    this.groups = this.groups.map((group) => (
      { ...group, tasks: renew(group.tasks, task) }
    ))
  }

  @action
  public async moveTask (
    fromGroupId: number,
    toGroupId: number,
    fromIndex: number,
    toIndex: number,
  ) {
    await db.moveTask(fromGroupId, toGroupId, fromIndex, toIndex)

    this.groups = reorderBetween(
      this.groups, 'tasks', fromGroupId, toGroupId, fromIndex, toIndex,
    )
  }

  @action
  public async removeTask (taskId: number) {
    const { groupId } = await db.removeTask(taskId)

    this.groups = this.groups.map((group) => (
      group.id === groupId
        ? { ...group, tasks: removeById(group.tasks, taskId) }
        : group
    ))
  }

  @action
  public async selectTask (taskId: number | null) {
    this.selectedId = taskId
  }

}
