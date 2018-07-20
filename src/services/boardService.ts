import { Observable, Subject } from 'rxjs'
import { combineLatest, concatMap, distinctUntilChanged, map, scan, shareReplay, switchMap } from 'rxjs/operators'

import store from '../store'
import { addModel, IBoard, IBoardAttributes, removeModel, updateModel } from '../models'

const initialBoards: IBoard[] = []

type BoardsGetter = (boards: IBoard[]) => IBoard[]

type AddBoardData = {boardId: number, boardAttrs: Partial<IBoardAttributes>}

export class BoardService {
  
  public boards$!: Observable<IBoard[]>
  
  public board$!: Observable<IBoard>

  private update$: Subject<BoardsGetter> = new Subject()

  private select$: Subject<number> = new Subject()

  public loadBoards$: Subject<void> = new Subject()

  public addBoard$: Subject<string> = new Subject()

  public updateBoard$: Subject<AddBoardData> = new Subject()

  public removeBoard$: Subject<number> = new Subject()

  public constructor () {
    this.boards$ = this.update$.pipe(
      scan<BoardsGetter, IBoard[]>((boards, operation) => operation(boards), initialBoards),
      shareReplay(1),
    )

    this.board$ = this.select$.pipe(
      distinctUntilChanged(),
      combineLatest(this.boards$, (boardId, boards) => boards.find((b) => b.id === boardId)),
      shareReplay(1),
    )

    this.loadBoards$.pipe(
      switchMap(() => store.listBoards()),
      map((boards) => () => boards),
    ).subscribe(this.update$)

    this.addBoard$.pipe(
      concatMap((title) => store.addBoard(title)),
      map((board) => (boards: IBoard[]) => addModel(boards, board, true)),
    ).subscribe(this.update$)

    this.updateBoard$.pipe(
      concatMap(({ boardId, boardAttrs }) => store.updateBoard(boardId, boardAttrs)),
      map((board) => (boards: IBoard[]) => updateModel(boards, board)),
    ).subscribe(this.update$)

    this.removeBoard$.pipe(
      concatMap((boardId) => store.removeBoard(boardId)),
      map((boardId) => (boards: IBoard[]) => removeModel(boards, boardId)),
    ).subscribe(this.update$)
  }

  public loadBoards () {
    this.loadBoards$.next()
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

  public selectBoard (id: number) {
    this.select$.next(id)
  }
}

const boardService  = new BoardService()

export default boardService
