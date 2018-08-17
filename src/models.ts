export interface IBase {
  id: number
  createdAt: number
}

export interface IBoardAttributes {
  title: string
  archived: boolean
  archivedAt: number
  groupIds: number[]
}

export interface IGroupAttributes {
  boardId: number
  title: string
  color: string
  taskIds: number[]
}

export interface ITaskAttributes {
  boardId: number
  groupId: number
  content: string
  contentHtml: string
  finished: boolean
  finishedAt: number
  DueAt: number
  tagIds: number[]
}

export interface ITagAttributes {
  boardId: number
  title: string
  color: string
}

export interface IBoard extends IBase, IBoardAttributes {
  groups: IGroup[]
}

export interface IGroup extends IBase, IGroupAttributes {
  tasks: ITask[]
}

export interface ITask extends IBase, ITaskAttributes {}

export interface ITag extends IBase, ITagAttributes {}
