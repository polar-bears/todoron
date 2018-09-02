import { Observable, Subject } from 'rxjs'
import { concatMap, share } from 'rxjs/operators'

import store from '../store'
import { IAction, ofType } from '../libs/action'
import { ITask } from '../models'
import { SELECT_TASK, SelectTaskAction, UPDATE_TASK, UpdateTaskAction } from './actions'

type TaskUpdater = (task: ITask) => ITask

export default class TaskViewService {

  public action$: Subject<IAction> = new Subject()

  public updater$: Subject<TaskUpdater> = new Subject()

  public selectTask$: Observable<ITask> = this.action$.pipe(
    ofType<SelectTaskAction>(SELECT_TASK),
    concatMap(({ payload: { taskId } }) => store.getTask(taskId)),
    share(),
  )

  public updateTask$: Observable<ITask> = this.action$.pipe(
    ofType<UpdateTaskAction>(UPDATE_TASK),
    concatMap(({ payload: { taskId, taskAttrs } }) => store.updateTask(taskId, taskAttrs)),
    share(),
  )

  public dispatch (action: IAction) {
    this.action$.next(action)
  }

}
