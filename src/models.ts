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

export function reorderModel<T extends IBase> (list: T[], fromIndex: number, toIndex: number) {
  list = [...list]

  const [removed] = list.splice(fromIndex, 1)
  list.splice(toIndex, 0, removed)

  return list
}

export function reorderModelBetweenList<T extends IBase>(
  list: T[],
  prop: string,
  fromId: number,
  toId: number,
  fromIndex: number,
  toIndex: number,
) {
  list = [...list]

  const from = list.find((item) => item.id === fromId) as any
  const to = list.find((item) => item.id === toId) as any

  const fromList = from[prop] = [...from[prop]]
  const toList = from === to ? fromList : to[prop] = [...to[prop]]

  const [removed] = fromList.splice(fromIndex, 1)
  toList.splice(toIndex, 0, removed)

  return list
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
