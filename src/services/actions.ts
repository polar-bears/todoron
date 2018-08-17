import { IAction } from '../libs/action'
import { IBoardAttributes, IGroupAttributes, ITaskAttributes } from '../models'

export const LIST_BOARDS = 'LIST_BOARDS'
export const ADD_BOARD = 'ADD_BOARD'
export const UPDATE_BOARD = 'UPDATE_BOARD'
export const REMOVE_BOARD = 'REMOVE_BOARD'

export const ADD_GROUP = 'ADD_GROUP'
export const UPDATE_GROUP = 'UPDATE_GROUP'
export const MOVE_GROUP = 'MOVE_GROUP'
export const REMOVE_GROUP = 'REMOVE_GROUP'

export const ADD_TASK = 'ADD_TASK'
export const UPDATE_TASK = 'UPDATE_TASK'
export const MOVE_TASK = 'MOVE_TASK'
export const REMOVE_TASK = 'REMOVE_TASK'

export type ListBoardsPayload = undefined
export class ListBoardsAction implements IAction {
  public readonly type = LIST_BOARDS
  public constructor (public payload: ListBoardsPayload = undefined) {}
}

export type AddBoardPayload = {title: string}
export class AddBoardAction implements IAction {
  public readonly type = ADD_BOARD
  public constructor (public payload: AddBoardPayload) {}
}

export type UpdateBoardPayload = {boardId: number, boardAttrs: Partial<IBoardAttributes>}
export class UpdateBoardAction implements IAction {
  public readonly type = UPDATE_BOARD
  public constructor (public payload: UpdateBoardPayload) {}
}

export type RemoveBoardPayload = {boardId: number}
export class RemoveBoardAction implements IAction {
  public readonly type = REMOVE_BOARD
  public constructor (public payload: RemoveBoardPayload) {}
}

export type AddGroupPayload = {boardId: number, title: string, color: string}
export class AddGroupAction implements IAction {
  public readonly type = ADD_GROUP
  public constructor (public payload: AddGroupPayload) {}
}

export type UpdateGroupPayload = {groupId: number, groupAttrs: Partial<IGroupAttributes>}
export class UpdateGroupAction implements IAction {
  public readonly type = UPDATE_GROUP
  public constructor (public payload: UpdateGroupPayload) {}
}

export type MoveGroupPayload = {boardId: number, fromIndex: number, toIndex: number}
export class MoveGroupAction implements IAction {
  public readonly type = MOVE_GROUP
  public constructor (public payload: MoveGroupPayload) {}
}

export type RemoveGroupPayload = {groupId: number}
export class RemoveGroupAction implements IAction {
  public readonly type = REMOVE_GROUP
  public constructor (public payload: RemoveGroupPayload) {}
}

export type AddTaskPayload = {groupId: number, content: string, contentHtml: string, dueAt: number, tagIds: number[]}
export class AddTaskAction implements IAction {
  public readonly type = ADD_TASK
  public constructor (public payload: AddTaskPayload) {}
}

export type UpdateTaskPayload = {taskId: number, taskAttrs: Partial<ITaskAttributes>}
export class UpdateTaskAction implements IAction {
  public readonly type = UPDATE_TASK
  public constructor (public payload: UpdateTaskPayload) {}
}

export type MoveTaskPayload = {fromGroupId: number, toGroupId: number, fromIndex: number, toIndex: number}
export class MoveTaskAction implements IAction {
  public readonly type = MOVE_TASK
  public constructor (public payload: MoveTaskPayload) {}
}

export type RemoveTaskPayload = {taskId: number}
export class RemoveTaskAction implements IAction {
  public readonly type = REMOVE_TASK
  public constructor (public payload: RemoveTaskPayload) {}
}
