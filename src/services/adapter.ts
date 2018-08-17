import { IBase } from '../models'

export function addOne<T extends IBase> (list: T[], newItem: T, prepend?: boolean) {
  return prepend ? [newItem, ...list] : [...list, newItem]
}

export function renew<T extends IBase> (list: T[], existedItem: T) {
  return list.map((item) => item.id === existedItem.id ? Object.assign({}, item, existedItem) : item)
}

export function reorder<T extends IBase> (list: T[], fromIndex: number, toIndex: number) {
  list = [...list]

  const [removed] = list.splice(fromIndex, 1)
  list.splice(toIndex, 0, removed)

  return list
}

export function reorderBetween<T extends IBase> (
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

export function removeById<T extends IBase> (list: T[], id: number) {
  return list.filter((item) => item.id !== id)
}
