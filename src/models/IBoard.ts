import { IBase } from './IBase'
import { IGroup } from './IGroup'

export interface IBoardAttributes {
  title: string
  archived: boolean
  archivedAt: number
  groupIds: number[]
}

export interface IBoard extends IBase, IBoardAttributes {
  groups: IGroup[]
}
