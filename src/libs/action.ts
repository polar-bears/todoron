import { Observable } from 'rxjs'
import { filter } from 'rxjs/operators'

export type ActionType = string | number

export interface IAction<T = any> {
  readonly type: ActionType,
  payload: T,
}

export function ofType<T extends IAction<any>> (...types: ActionType[]) {
  return (source: Observable<T>) => source.pipe(
    filter(({ type }) => types.indexOf(type) > -1),
  )
}
