import Dexie from 'dexie'

import { IBase, IBoard, IBoardAttributes, IGroup, IGroupAttributes, ITag, ITask, ITaskAttributes } from './models'

function create<T> (attributes: any): T {
  return { ...attributes, createdAt: Date.now() }
}

function toMap<T extends IBase> (list: T[]) {
  const map: { [key: number]: T } = {}

  return list.reduce((m, item) => {
    m[item.id] = item

    return m
  }, map)
}

export class TodoronDB extends Dexie {

  public boards!: Dexie.Table<IBoard, number>

  public groups!: Dexie.Table<IGroup, number>

  public tasks!: Dexie.Table<ITask, number>

  public tags!: Dexie.Table<ITag, number>

  public constructor () {
    super('Todoron')

    this.version(1).stores({
      boards: '++id, title, archived, archivedAt, createdAt',
      groups: '++id, boardId, title, color',
      tasks: '++id, boardId, groupId, content, contentHtml, finished, finishedAt, DueAt, tagIds',
      tags: '++id, boardId, title, color',
    })

  }

  public async getBoard (boardId: number) {
    const board = await this.boards.get(boardId)
    if (!board) throw new Error('Board not found')

    return board
  }

  public async getGroup (groupId: number) {
    const group = await this.groups.get(groupId)
    if (!group) throw new Error('Group not found')

    return group
  }

  public async getTask (taskId: number) {
    const task = await this.tasks.get(taskId)
    if (!task) throw new Error('Task not found')

    return task
  }

  public async listBoards () {
    return db.transaction('rw', db.boards, async () => {
      let boards = await db.boards.orderBy('createdAt').reverse().toArray()

      if (boards.length === 0) {
        const board = await this.addBoard('default')

        boards = [board]
      }

      return boards
    })
  }

  public async addBoard (title: string) {
    return db.transaction('rw', db.boards, async () => {
      const boardAttrs = { title, groupIds: [], archived: false, archivedAt: -1 }
      const boardId = await db.boards.add(create(boardAttrs))

      const board = await this.getBoard(boardId)
      board.groups = []

      return board
    })
  }

  public async updateBoard (boardId: number, boardAttrs: Partial<IBoardAttributes>) {
    return db.transaction('rw', db.boards, async () => {
      await db.boards.update(boardId, boardAttrs)

      return this.getBoard(boardId)
    })
  }

  public async removeBoard (boardId: number) {
    return db.transaction('rw', db.boards, async () => {
      await db.boards.delete(boardId)

      return boardId
    })
  }

  public async listGroups (boardId: number) {
    return db.transaction('r', db.boards, db.groups, db.tasks, async () => {
      const board = await this.getBoard(boardId)

      const groups = await db.groups.where({ boardId }).toArray()
      const tasks = await db.tasks.where({ boardId }).toArray()

      const groupMap = toMap(groups)
      const taskMap = toMap(tasks)

      return board.groupIds
        .map((groupId) => {
          const group = groupMap[groupId]

          if (group) {
            group.tasks = group.taskIds
              .map((taskId) => taskMap[taskId])
              .filter(Boolean)
          }

          return group
        })
        .filter(Boolean)
    })
  }

  public async addGroup (boardId: number, title: string) {
    return db.transaction('rw', db.boards, db.groups, async () => {
      const board = await this.getBoard(boardId)

      const groupAttrs = { boardId, title, color: '', taskIds: [] }
      const groupId = await db.groups.add(create(groupAttrs))
      await db.boards.update(boardId, { groupIds: [...board.groupIds, groupId] })

      const group = await this.getGroup(groupId)
      group.tasks = []

      return group
    })
  }

  public async updateGroup (groupId: number, groupAttrs: Partial<IGroupAttributes>) {
    return db.transaction('rw', db.groups, async () => {
      await db.groups.update(groupId, groupAttrs)

      return this.getGroup(groupId)
    })
  }

  public async moveGroup (boardId: number, fromIndex: number, toIndex: number) {
    return db.transaction('rw', db.boards, db.groups, async () => {
      const board = await this.getBoard(boardId)

      const groupIds = board.groupIds
      const [removed] = groupIds.splice(fromIndex, 1)
      groupIds.splice(toIndex, 0, removed)

      await db.boards.update(boardId, { groupIds })

      return { boardId, fromIndex, toIndex }
    })
  }

  public async removeGroup (groupId: number) {
    return db.transaction('rw', db.groups, db.tasks, db.boards, async () => {
      const group = await this.getGroup(groupId)
      const board = await this.getBoard(group.boardId)

      const groupIds = board.groupIds.filter((id) => id !== groupId)

      await db.boards.update(group.boardId, { groupIds })
      await db.tasks.where('groupId').equals(groupId).delete()
      await db.groups.delete(groupId)

      return groupId
    })
  }

  public async addTask (
    groupId: number,
    content: string,
    contentHtml: string,
    dueAt: number,
    tagIds: number[],
  ) {
    return db.transaction('rw', db.groups, db.tasks, async () => {
      const group = await this.getGroup(groupId)
      const boardId = group.boardId

      const taskAttrs = {
        boardId,
        groupId,
        content,
        contentHtml,
        dueAt,
        tagIds,
        finished: false,
        finishedAt: -1,
      }

      const taskId = await db.tasks.add(create(taskAttrs))
      await db.groups.update(groupId, { taskIds: [...group.taskIds, taskId] })

      return this.getTask(taskId)
    })
  }

  public async updateTask (taskId: number, taskAttrs: Partial<ITaskAttributes>) {
    return db.transaction('rw', db.tasks, async () => {
      await db.tasks.update(taskId, taskAttrs)

      return this.getTask(taskId)
    })
  }

  public async moveTask (fromGroupId: number, toGroupId: number, fromIndex: number, toIndex: number) {
    return db.transaction('rw', db.groups, db.tasks, async () => {
      const fromGroup = await this.getGroup(fromGroupId)
      const toGroup = await this.getGroup(toGroupId)

      const fromTaskIds = fromGroup.taskIds
      const toTaskIds = toGroup.taskIds

      const [removed] = fromTaskIds.splice(fromIndex, 1)

      if (fromGroupId === toGroupId) {
        fromTaskIds.splice(toIndex, 0, removed)
      } else {
        toTaskIds.splice(toIndex, 0, removed)
        await db.groups.update(toGroupId, { taskIds: toTaskIds })
      }

      await db.groups.update(fromGroupId, { taskIds: fromTaskIds })

      return { fromGroupId, toGroupId, fromIndex, toIndex }
    })
  }

  public async removeTask (taskId: number) {
    return db.transaction('rw', db.groups, db.tasks, async () => {
      const task = await this.getTask(taskId)
      const group = await this.getGroup(task.groupId)
      const groupId = group.id

      const taskIds = group.taskIds.filter((id) => id !== taskId)

      await db.groups.update(task.groupId, { taskIds })
      await db.tasks.delete(taskId)

      return { groupId, taskId }
    })
  }

}

const db = new TodoronDB()

export default db
