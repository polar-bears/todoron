import * as React from 'react'
import { Route, RouteComponentProps } from 'react-router'
import { DragDropContext, DraggableLocation, Droppable, DroppableProvided, DropResult } from 'react-beautiful-dnd'
import { observer } from 'mobx-react-lite'
import { Switch } from 'react-router-dom'

import GroupAddition from '../components/GroupAddition'
import TagContext from '../components/TagContext'
import TaskGroup from '../components/TaskGroup'
import styled from '../styles/styled-components'
import TaskView from './TaskView'
import { default as BoardStore } from '../stores/BoardStore'
import { default as TaskStore } from '../stores/TaskStore'
import { IGroup, ITask } from '../models'

const renderTaskView = (routeProps: any) => <TaskView {...routeProps} />

export interface Props extends RouteComponentProps<{ boardId: string }> {}

export default observer(function BoardView (props: Props) {
  const boardStore = React.useContext(BoardStore)
  const taskStore = React.useContext(TaskStore)

  const { groups } = taskStore

  const boardId = Number(props.match.params.boardId)

  React.useEffect(() => {
    if (boardStore.selectedBoard) {
      taskStore.listGroup(boardId)
    } else {
      props.history.push('/')
    }
  }, [boardId])

  const onDragEnd = React.useCallback((result: DropResult) => {
    if (!result.destination) return

    const source: DraggableLocation = result.source
    const destination: DraggableLocation = result.destination

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return
    }

    if (result.type === 'GROUP') {
      taskStore.moveGroup(
        Number(boardStore.selectedId!),
        Number(source.index),
        Number(destination.index)
      )
      return
    }

    taskStore.moveTask(
      Number(source.droppableId),
      Number(destination.droppableId),
      Number(source.index),
      Number(destination.index)
    )
  }, [])

  const onAddGroup = React.useCallback((title: string, reset: () => void) => {
    taskStore.addGroup(boardStore.selectedId!, title)

    reset()
  }, [])

  const onClickTask = React.useCallback((task: ITask) => {
    props.history.push(`/boards/${boardId}/task/${task.id}`)
  }, [])

  return (
    <TagContext.Provider value={{ tags: [] }}>
      <Container>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId='board' type='GROUP' direction='horizontal'>
            {(provided: DroppableProvided) => (
              <Container ref={provided.innerRef} {...provided.droppableProps}>
                {groups.map((group: IGroup, index: number) => {
                  return (
                    <TaskGroup
                      key={group.id}
                      index={index}
                      group={group}
                      onClickTask={onClickTask}
                    />
                  )
                })}
                <GroupAddition onConfirm={onAddGroup} />
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
      <Switch>
        <Route
          path='/boards/:boardId/task/:taskId'
          component={renderTaskView}
        />
      </Switch>
    </TagContext.Provider>
  )
})

const Container = styled.div(() => ({
  padding: '20px',
  verticalAlign: 'top',
  flexWrap: 'nowrap',
  display: 'inline-flex'
}))
