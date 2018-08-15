import { Observable, Subject } from 'rxjs'
import { combineLatest, concatMap, distinctUntilChanged, map, scan, shareReplay, switchMap } from 'rxjs/operators'

import store from '../store'
import {
  addModel,
  IBoard,
  IGroup,
  IGroupAttributes,
  ITaskAttributes,
  removeModel,
  reorderModel,
  reorderModelBetweenList,
  updateModel,
} from '../models'

const initialGroups: IGroup[] = []

type GroupsGetter = (groups: IGroup[]) => IGroup[]

type AddGroupData = {boardId: number, title: string, color: string}

type UpdateGroupData = {groupId: number, groupAttrs: Partial<IGroupAttributes>}

type MoveGroupData = {boardId: number, fromIndex: number, toIndex: number}

type AddTaskData = {groupId: number, content: string, contentHtml: string, dueAt: number, tagIds: number[]}

type UpdateTaskData = {taskId: number, taskAttrs: Partial<ITaskAttributes>}

type MoveTaskData = {fromGroupId: number, toGroupId: number, fromIndex: number, toIndex: number}

export default class BoardViewService {

  private action$: Subject<GroupsGetter> = new Subject()

  public board$: Observable<IBoard | undefined>

  public groups$: Observable<IGroup[]>

  public getBoard$: Subject<number> = new Subject()

  public addGroup$: Subject<AddGroupData> = new Subject()

  public updateGroup$: Subject<UpdateGroupData> = new Subject()

  public moveGroup$: Subject<MoveGroupData> = new Subject()

  public removeGroup$: Subject<number> = new Subject()

  public addTask$: Subject<AddTaskData> = new Subject()

  public updateTask$: Subject<UpdateTaskData> = new Subject()

  public moveTask$: Subject<MoveTaskData> = new Subject()

  public removeTask$: Subject<number> = new Subject()

  public constructor (boards$: Observable<IBoard[]>) {
    this.board$ = this.getBoard$.pipe(
      distinctUntilChanged(),
      combineLatest(boards$, (boardId, boards) => boards.find((b) => b.id === boardId)),
      shareReplay(1),
    )

    this.board$.pipe(
      switchMap((board) => board ? store.listGroups(board.id) : []),
      map((groups) => () => groups),
    ).subscribe(this.action$)

    this.groups$ = this.action$.pipe(
      scan<GroupsGetter, IGroup[]>((groups, operation) => operation(groups), initialGroups),
      shareReplay(1),
    )

    this.addGroup$.pipe(
      concatMap(({ boardId, title }) => store.addGroup(boardId, title)),
      map((group) => (groups: IGroup[]) => addModel(groups, group)),
    ).subscribe(this.action$)

    this.updateGroup$.pipe(
      concatMap(({ groupId, groupAttrs }) => store.updateGroup(groupId, groupAttrs)),
      map((group) => (groups: IGroup[]) => updateModel(groups, group)),
    ).subscribe(this.action$)

    this.moveGroup$.pipe(
      concatMap(({ boardId, fromIndex, toIndex }) => store.moveGroup(boardId, fromIndex, toIndex)),
      map(({ boardId, fromIndex, toIndex }) => (groups: IGroup[]) => reorderModel(groups, fromIndex, toIndex)),
    ).subscribe(this.action$)

    this.removeGroup$.pipe(
      concatMap((groupId) => store.removeGroup(groupId)),
      map((groupId) => (groups: IGroup[]) => removeModel(groups, groupId)),
    ).subscribe(this.action$)

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
    ).subscribe(this.action$)

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

    this.moveTask$.pipe(
      concatMap(({ fromGroupId, toGroupId, fromIndex, toIndex }) =>
        store.moveTask(fromGroupId, toGroupId, fromIndex, toIndex)),
      map(({ fromGroupId, toGroupId, fromIndex, toIndex }) => (groups: IGroup[]) => 
        reorderModelBetweenList(groups, 'tasks', fromGroupId, toGroupId, fromIndex, toIndex),
      ),
    ).subscribe(this.action$)

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

  public getBoard (id: number) {
    this.getBoard$.next(id)
  }

  public moveTask (fromGroupId: number, toGroupId: number, fromIndex: number, toIndex: number) {
    this.moveTask$.next({ fromGroupId, toGroupId, fromIndex, toIndex })
  }

  public moveGroup (boardId: number, fromIndex: number, toIndex: number) {
    this.moveGroup$.next({ boardId, fromIndex, toIndex })
  }

  public addGroup (boardId: number, title: string, color: string) {
    this.addGroup$.next({ boardId, title, color })
  }

  public addTask (groupId: number, content: string, contentHtml: string, dueAt: number, tagIds: number[]) {
    this.addTask$.next({ groupId, content, contentHtml, dueAt, tagIds })
  }
}
