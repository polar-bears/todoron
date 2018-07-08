export interface IBaseModel {
  id: string
}

export interface IBoard extends IBaseModel {
  title: string
  archived: string
  archivedAt: string
  createdAt: string
}

export interface IGroup extends IBaseModel {
  boardId: string
  title: string
  color: string
}

export interface ITask extends IBaseModel {
  boardId: string
  groupId: string
  content: string
  contentHtml: string
  finished: boolean
  finishedAt: string
  createdAt: string
  DueAt: string
  tagIds: string[]
}

export interface ITag extends IBaseModel {
  boardId: string
  title: string
  color: string
}
