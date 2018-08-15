import BoardViewService from './BoardViewService'
import HomeViewService from './HomeViewService'

export const homeViewService = new HomeViewService()

export const boardViewService = new BoardViewService(homeViewService.boards$)
