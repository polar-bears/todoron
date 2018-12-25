import * as React from 'react'
import Button from '../components/Button'
import Group from '../components/Group'
import TaskCard from '../components/TaskCard'
import styled from '../styles/styled-components'
import Card from './Card'
import Input from './Input'
import TaskAddition, { ConfirmData } from '../components/TaskAddition'
import { IGroup, ITask, ISortable } from '../models'
import Sortable from './Sortable'

export interface ITaskGroupProps {
  group: IGroup
  onAddTask?: (data: ConfirmData, reset: (reopen?: boolean) => void, fromShortcut: boolean) => void
  onClickTask?: (task: ITask) => void
  onFinishedChange?: (task: ITask) => void
  onRemoveGroup?: (group: IGroup) => void
  onEditGroup?: (group: IGroup, title: string) => void
  onSort?: ({ order, sortable, evt, remoteOrder, remoteSortable }: ISortable) => void
}

export interface ITaskGroupState {
  edit: boolean,
  title: string,
}

interface IInnerList {
  tasks: any
  onClickTask?: (task: ITask) => void
  onFinishedChange?: (task: ITask) => void
}

class InnerList extends React.Component<IInnerList> {

  public render () {
    return this.props.tasks && this.props.tasks.map((task: ITask, i: number) =>
      task && (
        <TaskCard
          key={task.id}
          task={task}
          index={i}
          onClick={this.props.onClickTask}
          onFinishedChange={this.props.onFinishedChange}
        />
      ),
    )
  }
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
  }) => {
    const { title, taskCount, edit } = params
    return (
      <Header>
        <Title edit={edit}>
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
    const { group, onAddTask, onClickTask, onFinishedChange, onSort } = this.props
    const { edit, title } = this.state

    const { id, tasks } = group
    const groupId = 'group' + id

    return (
      <Group
        type='group'
        groupId={id}
        key={groupId}
        header={this.renderHeader({
          edit,
          title,
          taskCount: tasks.length,
        })}
        footer={<TaskAddition groupId={id} onConfirm={onAddTask} />}
      >
        <Sortable
          options={{ group: 'tasks', animation: 150 }}
          onChange={onSort}
          tag={Wrapper}
          data-gid={id}
        >
          <InnerList tasks={tasks} onClickTask={onClickTask} onFinishedChange={onFinishedChange} />
        </Sortable>
      </Group>

    )
  }

}

const Wrapper = styled.div(() => ({
  minHeight: '90px',
  padding: '0 27px 0 10px',
}))

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
