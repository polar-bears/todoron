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

export function createModel<T extends IBase> (attributes: any): T {
  return { ...attributes, createdAt: Date.now() }
}

export function addModel<T extends IBase> (list: T[], newItem: T, prepend?: boolean) {
  return prepend ? [newItem, ...list] : [...list, newItem]
}

export function updateModel<T extends IBase> (list: T[], existedItem: T) {
  return list.map((item) => item.id === existedItem.id ? Object.assign({}, item, existedItem) : item)
}

export function removeModel<T extends IBase> (list: T[], id: number) {
  return list.filter((item) => item.id !== id)
}

export function toMap<T extends IBase> (list: T[]) {
  const map: {[key: number]: T} = {}

  return list.reduce((m, item) => {
    m[item.id] = item

    return m
  }, map)
}

export interface IBoard extends IBase, IBoardAttributes {
  groups: IGroup[]
}

export interface IGroup extends IBase, IGroupAttributes {
  tasks: ITask[]
}

export interface ITask extends IBase, ITaskAttributes {}

export interface ITag extends IBase, ITagAttributes {}
