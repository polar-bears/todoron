import db from './db'
import {
  createModel,
  toMap,
  IGroupAttributes,
  IBoardAttributes,
  ITaskAttributes,
} from './models'

async function getBoard (boardId: number) {
  const board = await db.boards.get(boardId)
  if (!board) throw new Error('Board not found')

  return board
}

async function getGroup (groupId: number) {
  const group = await db.groups.get(groupId)
  if (!group) throw new Error('Group not found')

  return group
}

async function getTask (taskId: number) {
  const task = await db.tasks.get(taskId)
  if (!task) throw new Error('Task not found')

  return task
}

export class TodoronStore {

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
      const boardId = await db.boards.add(createModel(boardAttrs))

      const board = await getBoard(boardId)
      board.groups = []

      return board
    })
  }

  public async updateBoard (boardId: number, boardAttrs: Partial<IBoardAttributes>) {
    return db.transaction('rw', db.boards, async () => {
      await db.boards.update(boardId, boardAttrs)

      return getBoard(boardId)
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
      const board = await getBoard(boardId)

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
      const board = await getBoard(boardId)

      const groupAttrs = { boardId, title, color: '', taskIds: [] }
      const groupId = await db.groups.add(createModel(groupAttrs))
      await db.boards.update(boardId, { groupIds: [...board.groupIds, groupId] })

      const group = await getGroup(groupId)
      group.tasks = []

      return group
    })
  }

  public async updateGroup (groupId: number, groupAttrs: Partial<IGroupAttributes>) {
    return db.transaction('rw', db.groups, async () => {
      await db.groups.update(groupId, groupAttrs)

      return getGroup(groupId)
    })
  }

  public async moveGroup (groupId: number, fromIndex: number, toIndex: number) {
    return db.transaction('rw', db.boards, db.groups, async () => {
      const group = await getGroup(groupId)
      const board = await getBoard(group.boardId)

      const groupIds = board.groupIds
      groupIds.splice(fromIndex, 1)
      groupIds.splice(toIndex, 0, groupId)

      await db.boards.update(group.boardId, { groupIds })

      return { groupId, fromIndex, toIndex }
    })
  }

  public async removeGroup (groupId: number) {
    return db.transaction('rw', db.groups, async () => {
      const group = await getGroup(groupId)
      const board = await getBoard(group.boardId)

      const groupIds = board.groupIds.filter((id) => id !== groupId)

      await db.boards.update(group.boardId, { groupIds })
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
      const group = await getGroup(groupId)
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

      const taskId = await db.tasks.add(createModel(taskAttrs))
      await db.groups.update(groupId, { taskIds: [...group.taskIds, taskId] })

      return getTask(taskId)
    })
  }

  public async updateTask (taskId: number, taskAttrs: Partial<ITaskAttributes>) {
    return db.transaction('rw', db.tasks, async () => {
      await db.tasks.update(taskId, taskAttrs)

      return getTask(taskId)
    })
  }

  public async moveTask (taskId: number, fromIndex: number, toIndex: number) {
    return db.transaction('rw', db.groups, db.tasks, async () => {
      const task = await getTask(taskId)
      const group = await getGroup(task.groupId)

      const taskIds = group.taskIds
      taskIds.splice(fromIndex, 1)
      taskIds.splice(toIndex, 0, taskId)

      await db.groups.update(task.groupId, { taskIds })

      return { taskId, fromIndex, toIndex }
    })
  }

  public async removeTask (taskId: number) {
    return db.transaction('rw', db.groups, db.tasks, async () => {
      const task = await getTask(taskId)
      const group = await getGroup(task.groupId)
      const groupId = group.id
  
      const taskIds = group.taskIds.filter((id) => id !== taskId)
  
      await db.groups.update(task.groupId, { taskIds })
      await db.tasks.delete(taskId)
  
      return { groupId, taskId }
    })
  }
}

const store = new TodoronStore()

export default store
