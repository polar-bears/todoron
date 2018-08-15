import { Observable, Subject } from 'rxjs'
import { concatMap, map, scan, shareReplay, switchMap } from 'rxjs/operators'

import store from '../store'
import { addModel, IBoard, IBoardAttributes, removeModel, updateModel } from '../models'

const initialBoards: IBoard[] = []

type BoardsGetter = (boards: IBoard[]) => IBoard[]

type UpdateBoardData = {boardId: number, boardAttrs: Partial<IBoardAttributes>}

export default class HomeViewService {

  private action$: Subject<BoardsGetter> = new Subject()

  public boards$: Observable<IBoard[]>

  public listBoards$: Subject<void> = new Subject()

  public addBoard$: Subject<string> = new Subject()

  public updateBoard$: Subject<UpdateBoardData> = new Subject()

  public removeBoard$: Subject<number> = new Subject()

  public constructor () {
    this.boards$ = this.action$.pipe(
      scan<BoardsGetter, IBoard[]>((boards, operation) => operation(boards), initialBoards),
      shareReplay(1),
    )

    this.listBoards$.pipe(
      switchMap(() => store.listBoards()),
      map((boards) => () => boards),
    ).subscribe(this.action$)

    this.addBoard$.pipe(
      concatMap((title) => store.addBoard(title)),
      map((board) => (boards: IBoard[]) => addModel(boards, board, true)),
    ).subscribe(this.action$)

    this.updateBoard$.pipe(
      concatMap(({ boardId, boardAttrs }) => store.updateBoard(boardId, boardAttrs)),
      map((board) => (boards: IBoard[]) => updateModel(boards, board)),
    ).subscribe(this.action$)

    this.removeBoard$.pipe(
      concatMap((boardId) => store.removeBoard(boardId)),
      map((boardId) => (boards: IBoard[]) => removeModel(boards, boardId)),
    ).subscribe(this.action$)
  }

  public listBoards () {
    this.listBoards$.next()
  }

  public addBoard (title: string) {
    this.addBoard$.next(title)
  }

  public updateBoard (boardId: number, boardAttrs: Partial<IBoardAttributes>) {
    this.updateBoard$.next({ boardId, boardAttrs })
  }

  public removeBoard (id: number) {
    this.removeBoard$.next(id)
  }

}
