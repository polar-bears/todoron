import SortableJS, { SortableEvent } from 'sortablejs'

export interface ISortableAttributes {
  order: string[],
  sortable: any,
  evt: SortableEvent,
  remoteOrder?: string[],
  remoteSortable?: any,
}

export interface ISortable extends SortableJS, ISortableAttributes {}
