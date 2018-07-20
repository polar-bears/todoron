import Dexie from 'dexie'

import { IBoard, IGroup, ITag, ITask } from './models'

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

}

const db = new TodoronDB()

export default db
