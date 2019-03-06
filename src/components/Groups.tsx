import * as React from 'react'
import {
  DragDropContext,
  DraggableLocation,
  Droppable,
  DroppableProvided,
  DropResult
} from 'react-beautiful-dnd'
import { observer } from 'mobx-react-lite'

import styled from '../styles/styled-components'
import GroupAddition from './GroupAddition'
import TaskGroup from './TaskGroup'
import { default as BoardStore } from '../stores/BoardStore'
import { default as TaskStore } from '../stores/TaskStore'
import { IGroup } from '../models'

export interface Props {
  containerHeight?: number
}

export default observer(function Board (props: Props) {
  const boardStore = React.useContext(BoardStore)
  const taskStore = React.useContext(TaskStore)

  const { groups } = taskStore

  const { containerHeight } = props

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

  const onAddGroup = (title: string, reset: () => void) => {
    taskStore.addGroup(boardStore.selectedId!, title)

    reset()
  }

  const board = (
    <Droppable
      droppableId='board'
      type='GROUP'
      direction='horizontal'
      ignoreContainerClipping={Boolean(containerHeight)}
    >
      {(provided: DroppableProvided) => (
        <Container ref={provided.innerRef} {...provided.droppableProps}>
          {groups.map((group: IGroup, index: number) => {
            return <TaskGroup key={group.id} index={index} group={group} />
          })}
          <GroupAddition onConfirm={onAddGroup} />
        </Container>
      )}
    </Droppable>
  )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      {containerHeight ? (
        <ParentContainer height={containerHeight}>{board}</ParentContainer>
      ) : (
        board
      )}
    </DragDropContext>
  )
})

const ParentContainer = styled.div<{ height: number }>(({ height }) => ({
  height: height
}))

const Container = styled.div(() => ({
  display: 'inline-flex'
}))
