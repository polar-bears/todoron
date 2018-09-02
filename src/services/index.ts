import BoardViewService from './BoardViewService'
import HomeViewService from './HomeViewService'
import TaskViewService from './TaskViewService'

export const homeViewService = new HomeViewService()

export const boardViewService = new BoardViewService(homeViewService.boards$)

export const taskViewService = new TaskViewService()
