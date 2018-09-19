import { ITask } from './ITask'
import { IBase } from './IBase'

export interface IGroupAttributes {
  boardId: number
  title: string
  color: string
  taskIds: number[]
}

export interface IGroup extends IBase, IGroupAttributes {
  tasks: ITask[]
}
