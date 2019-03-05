import * as React from 'react'
import { action, computed, observable } from 'mobx'

import db from '../db'
import { IBoard, IBoardAttributes } from '../models'
import { addOne, removeById, renew } from './adapter'

export class BoardStore {
  @observable public boards: IBoard[] = []

  @observable public selectedId: number | null = null

  @computed
  public get selectedBoard () {
    if (!this.selectedId && this.boards.length > 0) return this.boards[0]

    return this.boards.find((board) => board.id === this.selectedId)
  }

  @action
  public async listBoards () {
    this.boards = await db.listBoards()
  }

  @action
  public async addBoard (title: string) {
    const board = await db.addBoard(title)
    this.boards = addOne(this.boards, board, true)
  }

  @action
  public async updateBoard (
    boardId: number,
    boardAttrs: Partial<IBoardAttributes>
  ) {
    const board = await db.updateBoard(boardId, boardAttrs)
    this.boards = renew(this.boards, board)
  }

  @action
  public async removeBoard (boardId: number) {
    await db.removeBoard(boardId)
    this.boards = removeById(this.boards, boardId)
  }

  @action
  public async selectBoard (boardId: number | null) {
    this.selectedId = boardId
  }
}

export default React.createContext(new BoardStore())
