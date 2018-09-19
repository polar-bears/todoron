import * as React from 'react'
import { Draggable, DraggableProvided, Droppable, DroppableProvided } from 'react-beautiful-dnd'

import Button from '../components/Button'
import Group from '../components/Group'
import TaskCard from '../components/TaskCard'
import styled from '../styles/theme'
import Card from './Card'
import Input from './Input'
import TaskAddition, { ConfirmData } from '../components/TaskAddition'
import { IGroup, ITask } from '../models'

export interface ITaskGroupProps {
  group: IGroup
  index: number
  onAddTask?: (data: ConfirmData, reset: (reopen?: boolean) => void, fromShortcut: boolean) => void
  onClickTask?: (task: ITask) => void
  onFinishedChange?: (task: ITask) => void
  onRemoveGroup?: (group: IGroup) => void
  onEditGroup?: (group: IGroup, title: string) => void
}

export interface ITaskGroupState {
  edit: boolean,
  title: string,
}

export default class TaskGroup extends React.Component<ITaskGroupProps, ITaskGroupState> {
  public state = {
    edit: false,
    title: this.props.group.title,
  }

  private onRemove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onRemoveGroup, group } = this.props

    if (onRemoveGroup) {
      onRemoveGroup(group)
    }
  }

  private onEdit = (value: any) => {
    let title = typeof value === 'object' ? value.target.value : value

    const { onEditGroup, group } = this.props
    this.setState({ edit: false })
    if (onEditGroup) {
      onEditGroup(group, title)
    }
  }

  private setEdit = () => this.setState({ edit: true })

  private onTitleChange = (value: string) => this.setState({ title: value })

  private renderHeader = (params: {
    edit: boolean,
    title: string,
    taskCount: number,
    dragHandleProps: any,
  }) => {
    const { title, taskCount, dragHandleProps, edit } = params
    return (
      <Header>
        <Title edit={edit} {...dragHandleProps}>
          <label onDoubleClick={this.setEdit}>{title}</label>
          <span>&nbsp;({taskCount})</span>
        </Title>
        <Input value={title} onBlur={this.onEdit} onChange={this.onTitleChange} onEnter={this.onEdit} />
        <Actions>
          <Button size='small' icon='MoreVertical' />
        </Actions>
        <ActionsContent>
          <Card>
            <Option onClick={this.onRemove}>delete</Option>
            <Option onClick={this.setEdit}>edit</Option>
          </Card>
        </ActionsContent>
      </Header>
    )
  }

  public render () {
    const { group, index, onAddTask, onClickTask, onFinishedChange } = this.props
    const { edit, title } = this.state

    const { id, tasks } = group
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
                    header={this.renderHeader({
                      edit,
                      title,
                      taskCount: tasks.length,
                      dragHandleProps: provided.dragHandleProps,
                    })}
                    footer={<TaskAddition groupId={id} onConfirm={onAddTask} />}
                  >
                    {tasks.map((task, i) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        index={i}
                        onClick={onClickTask}
                        onFinishedChange={onFinishedChange}
                      />
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
  position: 'relative',
}))

const Title = styled.div<{ edit: boolean }>(({ theme, edit }) => ({
  color: theme.fg,
  opacity: edit ? 0 : 1,
  flex: 1,
  marginLeft: '10px',
  fontSize: '14px',
  height: '28px',
  lineHeight: '28px',
  '&>label': {
    display: 'block',
    maxWidth: '230px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    float: 'left',
  },
  '&>span': {
    float: 'left',
  },
  '&~div': {
    opacity: edit ? 0 : 1,
  },
  '&~input': {
    background: theme.bg,
    position: 'absolute',
    left: '10px',
    display: edit ? 'block' : 'none',
    width: '280px',
  },
}))

const Actions = styled.div(() => ({
  marginRight: '10px',
  '&:hover~div': {
    display: 'block',
  },
}))

const ActionsContent = styled.div(() => ({
  width: '80px',
  position: 'absolute',
  zIndex: 99,
  right: '10px',
  top: '34px',
  textAlign: 'center',
  lineHeight: '30px',
  display: 'none',
  transition: '0.3s',
  '&:hover': {
    background: '#eee',
    display: 'block',
  },
}))

const Option = styled.div(() => ({
  cursor: 'pointer',
  '&:hover': {
    background: '#eee',
  },
}))

const Container = styled.div(() => ({
  '&:empty': {
    padding: 0,
  },
}))
