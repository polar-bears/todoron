import * as React from 'react'
import { Draggable, DraggableProvided, Droppable, DroppableProvided, DroppableStateSnapshot } from 'react-beautiful-dnd'

import styled from '../styles/styled-components'
import TaskCard from './TaskCard'
import { ITask } from '../models'

interface TaskListProps {
  tasks: ITask[]
  groupId: number | string
  type: string
}

export default function TaskList (props: TaskListProps) {
  const { tasks, groupId, type } = props

  return (
    <Droppable droppableId={'' + groupId} type={type}>
        {(
          dropProvided: DroppableProvided,
          dropSnapshot: DroppableStateSnapshot
        ) => (
          <Wrapper {...dropProvided.droppableProps}>
            <DropZone ref={dropProvided.innerRef}>
              {tasks.map((task: ITask, index: number) => (
                <Draggable
                  key={task.id}
                  draggableId={'task-' + task.id}
                  index={index}
                >
                  {(dragProvided: DraggableProvided) => (
                    <TaskWrapper
                      ref={dragProvided.innerRef}
                      {...dragProvided.draggableProps}
                      {...dragProvided.dragHandleProps}
                    >
                      <TaskCard key={task.id} task={task} index={index} />
                    </TaskWrapper>
                  )}
                </Draggable>
              ))}
              {dropProvided.placeholder}
            </DropZone>
          </Wrapper>
        )}
      </Droppable>
  )
}

const Wrapper = styled.div(() => ({}))

const TaskWrapper = styled.div(() => ({}))

const DropZone = styled.div(() => ({
  overflowX: 'hidden',
  minHeight: '80px',
  maxHeight: '600px'
}))
