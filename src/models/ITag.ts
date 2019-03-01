import { IBase } from './IBase'

export interface ITagAttributes {
  boardId: number
  title: string
  color: string
}

export interface ITag extends IBase, ITagAttributes {}
