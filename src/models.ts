export interface IBase {
  id: number
  createdAt: number
}

export interface IBoardAttributes {
  title: string
  archived: boolean
  archivedAt: number
}

export interface IGroupAttributes {
  boardId: number
  title: string
  color: string
}

export interface ITaskAttributes {
  boardId: number
  groupId: number
  content: string
  contentHtml: string
  finished: boolean
  finishedAt: number
  DueAt: number
  tagIds: string[]
}

export interface ITagAttributes {
  boardId: number
  title: string
  color: string
}

export function createModel<T extends IBase> (attributes: any): T {
  return { ...attributes, createdAt: Date.now() }
}

export function addModel<T extends IBase> (list: T[], newItem: T) {
  return [newItem, ...list]
}

export function updateModel<T extends IBase> (list: T[], existedItem: T) {
  return list.map((item) => item.id === existedItem.id ? Object.assign({}, item, existedItem) : item)
}

export function removeModel<T extends IBase> (list: T[], id: number) {
  return list.filter((item) => item.id !== id)
}

export interface IBoard extends IBase, IBoardAttributes {}

export interface IGroup extends IBase, IGroupAttributes {}

export interface ITask extends IBase, ITaskAttributes {}

export interface ITag extends IBase, ITagAttributes {}
