import { Observable, Subject } from 'rxjs'
import { shareReplay, scan, map, switchMap, concatMap } from 'rxjs/operators'

import store from '../store'
import boardService from './boardService'
import { IGroup, ITask, addModel, updateModel, removeModel, IGroupAttributes, ITaskAttributes } from '../models'

const initialGroups: IGroup[] = []

type GroupsGetter = (groups: IGroup[]) => IGroup[]

type AddGroupData = {boardId: number, title: string, color: string}

type UpdateGroupData = {groupId: number, groupAttrs: Partial<IGroupAttributes>}

type MoveGroupData = {groupId: number, fromIndex: number, toIndex: number}

type AddTaskData = {groupId: number, content: string, contentHtml: string, dueAt: number, tagIds: number[]}

type UpdateTaskData = {taskId: number, taskAttrs: Partial<ITaskAttributes>}

type MoveTaskData = {taskId: number, fromIndex: number, toIndex: number}

export class GroupService {

  public groups$!: Observable<IGroup[]>

  private update$: Subject<GroupsGetter> = new Subject()

  private addGroup$: Subject<AddGroupData> = new Subject()

  private updateGroup$: Subject<UpdateGroupData> = new Subject()

  private moveGroup$: Subject<MoveGroupData> = new Subject()

  private removeGroup$: Subject<number> = new Subject()

  private addTask$: Subject<AddTaskData> = new Subject()

  private updateTask$: Subject<UpdateTaskData> = new Subject()

  private moveTask$: Subject<MoveTaskData> = new Subject()

  private removeTask$: Subject<number> = new Subject()

  public constructor () {
    this.groups$ = this.update$.pipe(
      scan<GroupsGetter, IGroup[]>((groups, operation) => operation(groups), initialGroups),
      shareReplay(1),
    )

    boardService.board$.pipe(
      switchMap((board) => store.listGroups(board.id)),
      map((groups) => () => groups),
    ).subscribe(this.update$)

    this.addGroup$.pipe(
      concatMap(({ boardId, title }) => store.addGroup(boardId, title)),
      map((group) => (groups: IGroup[]) => addModel(groups, group)),
    ).subscribe(this.update$)

    this.updateGroup$.pipe(
      concatMap(({ groupId, groupAttrs }) => store.updateGroup(groupId, groupAttrs)),
      map((group) => (groups: IGroup[]) => updateModel(groups, group)),
    ).subscribe(this.update$)

    this.removeGroup$.pipe(
      concatMap((groupId) => store.removeGroup(groupId)),
      map((groupId) => (groups: IGroup[]) => removeModel(groups, groupId)),
    ).subscribe(this.update$)

    this.addTask$.pipe(
      concatMap(({ groupId, content, contentHtml, dueAt, tagIds }) => (
        store.addTask(groupId, content, contentHtml, dueAt, tagIds)
      )),
      map((task) => (groups: IGroup[]) => (
        groups.map((group) => {
          return group.id === task.groupId
            ? { ...group, tasks: addModel(group.tasks, task) }
            : group
        })
      )),
    ).subscribe(this.update$)

    this.updateTask$.pipe(
      concatMap(({ taskId, taskAttrs }) => store.updateTask(taskId, taskAttrs)),
      map((task) => (groups: IGroup[]) => (
        groups.map((group) => {
          return group.id === task.groupId
            ? { ...group, tasks: updateModel(group.tasks, task) }
            : group
        })
      )),
    )

    this.removeTask$.pipe(
      concatMap((taskId) => store.removeTask(taskId)),
      map(({ groupId, taskId }) => (groups: IGroup[]) => (
        groups.map((group) => {
          return group.id === groupId
            ? { ...group, tasks: removeModel(group.tasks, taskId) }
            : group
        })
      )),
    )

  }

  public addGroup (boardId: number, title: string, color: string) {
    this.addGroup$.next({ boardId, title, color })
  }

  public addTask (groupId: number, content: string, contentHtml: string, dueAt: number, tagIds: number[]) {
    this.addTask$.next({ groupId, content, contentHtml, dueAt, tagIds })
  }
}

const groupService = new GroupService()

export default groupService
