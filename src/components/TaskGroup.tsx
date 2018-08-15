import * as React from 'react'
import styled from 'react-emotion'
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd'

import Button from '../components/Button'
import Group from '../components/Group'
import TaskCard from '../components/TaskCard'
import TaskAddition, { ConfirmData } from '../components/TaskAddition'
import { IGroup } from '../models'

export interface ITaskGroupProps {
  group: IGroup
  index: number
  onAddTask?: (data: ConfirmData, reset: (reopen?: boolean) => void, fromShortcut: boolean) => void
}

export interface ITaskGroupState { }

export default class TaskGroup extends React.Component<ITaskGroupProps, ITaskGroupState> {

  private renderHeader = (title: string, taskCount: number, dragHandleProps: any) => {
    return (
      <Header {...dragHandleProps}>
        <Title>{title} ({taskCount})</Title>
        <Actions>
          <Button size='small' icon='MoreVertical' />
        </Actions>
      </Header>
    )
  }

  public render () {
    const { group, index, onAddTask } = this.props

    const { id, title, tasks } = group
    const groupId = id.toString()

    return (
      <Draggable key={id} draggableId={groupId} index={index}>
        {(provided: DraggableProvided) => (
          <Wrapper innerRef={provided.innerRef} {...provided.draggableProps}>
            <Droppable droppableId={groupId} type='TASKS'>
              {(dropProvided: DroppableProvided) => (
                <Container innerRef={dropProvided.innerRef} {...dropProvided.droppableProps}>
                  <Group
                    key={id}
                    header={this.renderHeader(title, tasks.length, provided.dragHandleProps)}
                    footer={<TaskAddition groupId={id} onConfirm={onAddTask} />}
                  >
                    {tasks.map((task, i) => (
                      <TaskCard key={task.id} task={task} index={i} />
                    ))}
                    {dropProvided.placeholder}
                  </Group>
                </Container>
              )}
            </Droppable>
          </Wrapper>
        )}
      </Draggable>
    )
  }

}

const Wrapper = styled.div(() => ({}))

const Header = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: '40px',
}))

const Title = styled.div(({ theme }) => ({
  color: theme.fg,
  flex: 1,
  marginLeft: '10px',
  fontSize: '14px',
}))

const Actions = styled.div(() => ({
  marginRight: '10px',
}))

const Container = styled.div(() => ({
  '&:empty': {
    padding: 0,
  },
}))
