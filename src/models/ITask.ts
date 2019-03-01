import { IBase } from './IBase'

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

export interface ITask extends IBase, ITaskAttributes {}
