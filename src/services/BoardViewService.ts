import { Observable, Subject } from 'rxjs'
import { combineLatest, concatMap, distinctUntilChanged, scan, share, shareReplay, switchMap } from 'rxjs/operators'

import store from '../store'
import { IBoard, IGroup, ITask } from '../models'
import { IAction, ofType } from '../libs/action'
import {
  ADD_GROUP,
  ADD_TASK,
  AddGroupAction,
  AddTaskAction,
  MOVE_GROUP,
  MOVE_TASK,
  MoveGroupAction,
  MoveGroupPayload,
  MoveTaskAction,
  MoveTaskPayload,
  REMOVE_GROUP,
  REMOVE_TASK,
  RemoveGroupAction,
  RemoveTaskAction,
  UPDATE_GROUP,
  UPDATE_TASK,
  UpdateGroupAction,
  UpdateTaskAction,
} from './actions'
import { addOne, removeById, renew, reorder, reorderBetween } from './adapter'

type GroupsUpdater = (groups: IGroup[]) => IGroup[]

const initialGroups: IGroup[] = []

export default class BoardViewService {

  public action$: Subject<IAction> = new Subject()

  public updater$: Subject<GroupsUpdater> = new Subject()

  public board$: Observable<IBoard | undefined>

  public selectBoard$: Subject<number> = new Subject()

  public groups$ = this.updater$.pipe(
    scan<GroupsUpdater, IGroup[]>((groups, operation) => operation(groups), initialGroups),
    shareReplay(1),
  )

  public addGroup$: Observable<IGroup> = this.action$.pipe(
    ofType<AddGroupAction>(ADD_GROUP),
    concatMap(({ payload: { boardId, title } }) => store.addGroup(boardId, title)),
    share(),
  )

  public updateGroup$: Observable<IGroup> = this.action$.pipe(
    ofType<UpdateGroupAction>(UPDATE_GROUP),
    concatMap(({ payload: { groupId, groupAttrs } }) => store.updateGroup(groupId, groupAttrs)),
    share(),
  )

  public moveGroup$: Observable<MoveGroupPayload> = this.action$.pipe(
    ofType<MoveGroupAction>(MOVE_GROUP),
    concatMap(({ payload: { boardId, fromIndex, toIndex } }) => store.moveGroup(boardId, fromIndex, toIndex)),
    share(),
  )

  public removeGroup$: Observable<number> = this.action$.pipe(
    ofType<RemoveGroupAction>(REMOVE_GROUP),
    concatMap(({ payload: { groupId } }) => store.removeGroup(groupId)),
    share(),
  )

  public addTask$: Observable<ITask> = this.action$.pipe(
    ofType<AddTaskAction>(ADD_TASK),
    concatMap(({ payload: { groupId, content, contentHtml, dueAt, tagIds } }) => (
      store.addTask(groupId, content, contentHtml, dueAt, tagIds)
    )),
    share(),
  )

  public updateTask$: Observable<ITask> = this.action$.pipe(
    ofType<UpdateTaskAction>(UPDATE_TASK),
    concatMap(({ payload: { taskId, taskAttrs } }) => store.updateTask(taskId, taskAttrs)),
    share(),
  )

  public moveTask$: Observable<MoveTaskPayload> = this.action$.pipe(
    ofType<MoveTaskAction>(MOVE_TASK),
    concatMap(({ payload: { fromGroupId, toGroupId, fromIndex, toIndex } }) =>
      store.moveTask(fromGroupId, toGroupId, fromIndex, toIndex)),
    share(),
  )

  public removeTask$: Observable<{groupId: number, taskId: number}> = this.action$.pipe(
    ofType<RemoveTaskAction>(REMOVE_TASK),
    concatMap(({ payload: { taskId } }) => store.removeTask(taskId)),
    share(),
  )

  public constructor (boards$: Observable<IBoard[]>) {
    this.board$ = this.selectBoard$.pipe(
      distinctUntilChanged(),
      combineLatest(boards$, (boardId, boards) => boards.find((b) => b.id === boardId)),
      shareReplay(1),
    )

    this.board$.pipe(
      switchMap((board) => board ? store.listGroups(board.id) : []),
      share(),
    ).subscribe((groups) => {
      this.updater$.next(() => groups)
    })

    this.addGroup$.subscribe((group) => {
      this.updater$.next((groups: IGroup[]) => addOne(groups, group))
    })

    this.updateGroup$.subscribe((group) => {
      this.updater$.next((groups: IGroup[]) => renew(groups, group))
    })

    this.moveGroup$.subscribe(({ boardId, fromIndex, toIndex }) => {
      this.updater$.next((groups: IGroup[]) => reorder(groups, fromIndex, toIndex))
    })

    this.removeGroup$.subscribe((groupId) => {
      this.updater$.next((groups: IGroup[]) => removeById(groups, groupId))
    })

    this.addTask$.subscribe((task) => {
      this.updater$.next((groups: IGroup[]) => (
        groups.map((group) => {
          return group.id === task.groupId
            ? { ...group, tasks: addOne(group.tasks, task) }
            : group
        })
      ))
    })

    this.updateTask$.subscribe((task) => {
      this.updater$.next((groups: IGroup[]) => (
        groups.map((group) => {
          return group.id === task.groupId
            ? { ...group, tasks: renew(group.tasks, task) }
            : group
        })
      ))
    })

    this.moveTask$.subscribe(({ fromGroupId, toGroupId, fromIndex, toIndex }) => {
      this.updater$.next(
        (groups: IGroup[]) => reorderBetween(groups, 'tasks', fromGroupId, toGroupId, fromIndex, toIndex),
      )
    })

    this.removeTask$.subscribe(({ groupId, taskId }) => {
      this.updater$.next((groups: IGroup[]) => (
        groups.map((group) => {
          return group.id === groupId
            ? { ...group, tasks: removeById(group.tasks, taskId) }
            : group
        })
      ))
    })
  }

  public dispatch (action: IAction) {
    this.action$.next(action)
  }

}
