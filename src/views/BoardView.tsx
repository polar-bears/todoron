import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { Subscription } from 'rxjs'
import { tag } from 'rxjs-spy/operators/tag'
import { DragDropContext, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd'
import { Route, Switch } from 'react-router-dom'

import Group from '../components/Group'
import GroupAddition from '../components/GroupAddition'
import ScrollArea from '../components/ScrollArea'
import TagContext from '../components/TagContext'
import TaskGroup from '../components/TaskGroup'
import styled from '../styles/theme'
import TaskView from './TaskView'
import { IBoard, IGroup, ITag, ITask } from '../models'
import { boardViewService } from '../services'
import {
  AddGroupAction,
  AddTaskAction,
  MoveGroupAction,
  MoveTaskAction,
  RemoveGroupAction,
  UpdateGroupAction,
  UpdateTaskAction,
} from '../services/actions'

export interface IProps extends RouteComponentProps<{ boardId: string }> { }

export interface IState {
  loading: boolean
  board?: IBoard
  groups: IGroup[]
  tags: ITag[]
}

export default class BoardView extends React.Component<IProps, IState> {

  private board$!: Subscription

  private groups$!: Subscription

  // private tag$!: Subscription

  public state: IState = {
    loading: true,
    groups: [],
    tags: [],
  }

  public componentDidMount () {
    this.board$ = boardViewService.board$
      .subscribe((board) => {
        if (board) {
          this.setState({ board })
        } else {
          this.props.history.push('/')
        }
      })

    this.groups$ = boardViewService.groups$
      .pipe(tag('groups$'))
      .subscribe((groups) => this.setState({ groups, loading: false }))

    const boardId = Number(this.props.match.params.boardId)
    boardViewService.selectBoard$.next(boardId)
  }

  public componentDidUpdate (prevProps: IProps, prevState: IState) {
    const boardId = Number(this.props.match.params.boardId)
    const prevBoardId = Number(prevProps.match.params.boardId)

    if (boardId !== prevBoardId) {
      boardViewService.selectBoard$.next(boardId)
    }
  }

  public componentWillUnmount () {
    this.board$.unsubscribe()
    this.groups$.unsubscribe()
  }

  private onAddGroup = (title: string, reset: () => void) => {
    const boardId = this.state.board!.id

    boardViewService.dispatch(new AddGroupAction({ boardId, title, color: '' }))

    reset()
  }

  private onRemoveGroup = (group: IGroup) => {
    boardViewService.dispatch(new RemoveGroupAction({ groupId: group.id }))
  }

  private onEditGroup = (group: IGroup, title: string) => {
    boardViewService.dispatch(new UpdateGroupAction({ groupId: group.id, groupAttrs: { title } }))
  }

  private onAddTask = ({ groupId, content }: any, reset: (reopen: boolean) => void, fromShortcut: boolean) => {
    boardViewService.dispatch(
      new AddTaskAction({ groupId, content, contentHtml: '', dueAt: -1, tagIds: [] }),
    )

    reset(fromShortcut)
  }

  private onClickTask = (task: ITask) => {
    this.props.history.push(`/boards/${task.boardId}/task/${task.id}`)
  }

  private onDragEnd = (result: DropResult) => {
    const { destination, source, type } = result

    if (
      !destination ||
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) return

    if (type === 'GROUPS') {
      const boardId = this.state.board!.id
      boardViewService.dispatch(
        new MoveGroupAction({
          boardId,
          fromIndex: source.index,
          toIndex: destination.index,
        }),
      )
    } else if (type === 'TASKS') {
      boardViewService.dispatch(
        new MoveTaskAction({
          fromGroupId: Number(source.droppableId),
          toGroupId: Number(destination.droppableId),
          fromIndex: source.index,
          toIndex: destination.index,
        }),
      )
    }
  }

  private onFinishedChange = (task: ITask) => {
    const taskId = task.id
    boardViewService.dispatch(new UpdateTaskAction({ taskId, taskAttrs: { finished: !task.finished } }))
  }

  public render () {
    const { loading, groups } = this.state

    if (loading) {
      return null
    }

    return (
      <TagContext.Provider value={{ tags: [] }}>
        <Wrapper>
          <Header />
          <ScrollArea direction='horizontal'>
            <Container>
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable
                  droppableId='board'
                  type='GROUPS'
                  direction='horizontal'
                >
                  {(provided: DroppableProvided) => (
                    <Inner innerRef={provided.innerRef} {...provided.droppableProps}>
                      {groups.map((group, index) => (
                        <TaskGroup
                          key={index}
                          group={group}
                          index={index}
                          onAddTask={this.onAddTask}
                          onClickTask={this.onClickTask}
                          onFinishedChange={this.onFinishedChange}
                          onRemoveGroup={this.onRemoveGroup}
                          onEditGroup={this.onEditGroup}
                        />
                      ))}
                    </Inner>
                  )}
                </Droppable>
              </DragDropContext>
              <Group header={<GroupAddition onConfirm={this.onAddGroup} />} />
            </Container>
          </ScrollArea>
        </Wrapper>
        <Switch>
          <Route path='/boards/:boardId/task/:taskId' component={TaskView} />
        </Switch>
      </TagContext.Provider>
    )
  }
}

const Wrapper = styled.div(() => ({
  position: 'relative',
  height: '100%',
  padding: '0px',
}))

const Header = styled.div()

const Container = styled.div(() => ({
  padding: '20px 20px 50px',
  height: '100%',
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
}))

const Inner = styled.div(() => ({
  display: 'inline-flex',
}))
