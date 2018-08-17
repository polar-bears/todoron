import { Observable, Subject } from 'rxjs'
import { concatMap, scan, share, shareReplay, switchMap } from 'rxjs/operators'

import store from '../store'
import { IAction, ofType } from '../libs/action'
import {
  ADD_BOARD,
  AddBoardAction,
  LIST_BOARDS,
  ListBoardsAction,
  REMOVE_BOARD,
  RemoveBoardAction,
  UPDATE_BOARD,
  UpdateBoardAction,
} from './actions'
import { IBoard } from '../models'
import { addOne, removeById, renew } from './adapter'

type BoardsUpdater = (boards: IBoard[]) => IBoard[]

const initialBoards: IBoard[] = []

export default class HomeViewService {

  public action$: Subject<IAction> = new Subject()

  public updater$: Subject<BoardsUpdater> = new Subject()

  public boards$: Observable<IBoard[]> = this.updater$.pipe(
    scan<BoardsUpdater, IBoard[]>((boards, operation) => operation(boards), initialBoards),
    shareReplay(1),
  )

  public listBoards$: Observable<IBoard[]> = this.action$.pipe(
    ofType<ListBoardsAction>(LIST_BOARDS),
    switchMap(() => store.listBoards()),
    share(),
  )

  public addBoard$: Observable<IBoard> = this.action$.pipe(
    ofType<AddBoardAction>(ADD_BOARD),
    concatMap(({ payload: { title } }) => store.addBoard(title)),
    share(),
  )

  public updateBoard$: Observable<IBoard> = this.action$.pipe(
    ofType<UpdateBoardAction>(UPDATE_BOARD),
    concatMap(({ payload: { boardId, boardAttrs } }) => store.updateBoard(boardId, boardAttrs)),
    share(),
  )

  public removeBoard$: Observable<number> = this.action$.pipe(
    ofType<RemoveBoardAction>(REMOVE_BOARD),
    concatMap(({ payload: { boardId } }) => store.removeBoard(boardId)),
    share(),
  )

  public constructor () {
    this.listBoards$.subscribe((boards) => {
      this.updater$.next(() => boards)
    })

    this.addBoard$.subscribe((board) => {
      this.updater$.next((boards: IBoard[]) => addOne(boards, board, true))
    })

    this.updateBoard$.subscribe((board) => {
      this.updater$.next((boards: IBoard[]) => renew(boards, board))
    })

    this.removeBoard$.subscribe((boardId) => {
      this.updater$.next((boards: IBoard[]) => removeById(boards, boardId))
    })
  }

  public dispatch (action: IAction) {
    this.action$.next(action)
  }

}
