import { Observable, Subject } from 'rxjs'
import { scan, shareReplay, map, combineLatest, distinctUntilChanged } from 'rxjs/operators'

import db from '../db'
import { IBoard, IBoardAttributes, createModel, updateModel, removeModel, addModel } from '../models'

const initialBoards: IBoard[] = []

type BoardsGetter = (boards: IBoard[]) => IBoard[]

export class BoardService {
  
  public boards$!: Observable<IBoard[]>
  
  public board$!: Observable<IBoard>

  private update$: Subject<BoardsGetter> = new Subject()

  private select$: Subject<number> = new Subject()

  public loadBoard$: Subject<IBoard[]> = new Subject()

  public addBoard$: Subject<IBoard> = new Subject()

  public updateBoard$: Subject<IBoard> = new Subject()

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

    this.loadBoard$.pipe(
      map((boards) => () => boards),
    ).subscribe(this.update$)

    this.addBoard$.pipe(
      map((board) => (boards: IBoard[]) => addModel(boards, board)),
    ).subscribe(this.update$)

    this.addBoard$.pipe(
      map((board) => board.id),
    ).subscribe(this.select$)

    this.updateBoard$.pipe(
      map((board) => (boards: IBoard[]) => updateModel(boards, board)),
    ).subscribe(this.update$)

    this.removeBoard$.pipe(
      map((id) => (boards: IBoard[]) => removeModel(boards, id)),
    ).subscribe(this.update$)
  }

  public async loadBoards () {
    let boards = await db.boards.orderBy('createdAt').reverse().toArray()
    
    if (!boards.length) {
      await db.boards.add(createModel({ title: 'default', archived: false, archivedAt: -1 }))
      boards = await db.boards.toArray()
    }

    this.loadBoard$.next(boards)
  }

  public async addBoard (title: string) {
    const newBoard: IBoardAttributes = { title, archived: false, archivedAt: -1 }
    const boardId = await db.boards.add(createModel(newBoard))
    const board = await db.boards.get(boardId)

    this.addBoard$.next(board)
  }

  public async updateBoard (id: number, newBoard: Partial<IBoardAttributes>) {
    const boardId = await db.boards.update(id, newBoard)
    const board = await db.boards.get(boardId)

    this.updateBoard$.next(board)
  }

  public async removeBoard (id: number) {
    await db.boards.delete(id)

    this.removeBoard$.next(id)
  }

  public async selectBoard (id: number) {
    this.select$.next(id)
  }
}

const boardService  = new BoardService()

export default boardService
