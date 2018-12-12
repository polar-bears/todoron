import * as React from 'react'
import { RouteComponentProps } from 'react-router'
import { DragDropContext, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd'
import { Route, Switch } from 'react-router-dom'
import { observer } from 'mobx-react'

import Group from '../components/Group'
import GroupAddition from '../components/GroupAddition'
import ScrollArea from '../components/ScrollArea'
import TagContext from '../components/TagContext'
import TaskGroup from '../components/TaskGroup'
import styled from '../styles/theme'
import TaskView from './TaskView'
import { IGroup, ITask } from '../models'
import { boardStore, taskStore } from '../stores'

export interface IProps extends RouteComponentProps<{ boardId: string }> { }

export interface IState {
  loading: boolean
}

@observer
export default class BoardView extends React.Component<IProps, IState> {

  public state: IState = {
    loading: true,
  }

  public componentDidMount () {
    const boardId = Number(this.props.match.params.boardId)

    this.load(boardId)
  }

  public componentDidUpdate (prevProps: IProps, prevState: IState) {
    const boardId = Number(this.props.match.params.boardId)
    const prevBoardId = Number(prevProps.match.params.boardId)

    if (boardId !== prevBoardId) {
      this.load(boardId)
    }
  }

  public componentWillUnmount () {
    boardStore.selectBoard(null)
  }

  private load (boardId: number) {
    boardStore.selectBoard(boardId)

    if (boardStore.selectedBoard) {
      this.setState({ loading: true })

      taskStore.listGroup(boardId)

      this.setState({ loading: false })
    } else {
      this.props.history.push('/')
    }
  }

  private onAddGroup = async (title: string, reset: () => void) => {
    await taskStore.addGroup(boardStore.selectedId!, title)

    reset()
  }

  private onRemoveGroup = async (group: IGroup) => {
    await taskStore.removeGroup(group.id)
  }

  private onEditGroup = async (group: IGroup, title: string) => {
    await taskStore.updateGroup(group.id, { title })
  }

  private onAddTask = async (
    { groupId, content }: any,
    reset: (reopen: boolean) => void, fromShortcut: boolean,
  ) => {
    await taskStore.addTask(groupId, content, '', -1, [])
    reset(fromShortcut)
  }

  private onClickTask = (task: ITask) => {
    this.props.history.push(`/boards/${task.boardId}/task/${task.id}`)
  }

  private onDragEnd = async (result: DropResult) => {
    const { destination, source, type } = result

    if (
      !destination
      || source.droppableId === destination.droppableId
      && source.index === destination.index
    ) {
      return
    }

    if (type === 'GROUPS') {
      await taskStore.moveGroup(
        boardStore.selectedId!,
        source.index,
        destination.index,
      )
    } else if (type === 'TASKS') {
      await taskStore.moveTask(
        Number(source.droppableId),
        Number(destination.droppableId),
        source.index,
        destination.index,
      )
    }
  }

  private onFinishedChange = async (task: ITask) => {
    await taskStore.updateTask(task.id, { finished: !task.finished })
  }

  public render () {
    const { loading } = this.state
    const { groups } = taskStore

    if (loading) return null

    return (
      <TagContext.Provider value={{ tags: [] }}>
        <Wrapper>
          <Header/>
          <ScrollArea direction='horizontal'>
            <Container>
              <DragDropContext
                onDragEnd={this.onDragEnd}
              >
                <Droppable
                  droppableId='board'
                  type='GROUPS'
                  direction='horizontal'
                >
                  {(provided: DroppableProvided) => (
                    <Inner innerRef={provided.innerRef} {...provided.droppableProps}>
                      {groups.map((group, index) => (
                        <TaskGroup
                          key={group.id}
                          group={group}
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
