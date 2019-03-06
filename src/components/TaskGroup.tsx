import * as React from 'react'
import { Draggable, DraggableProvided, DraggableStateSnapshot } from 'react-beautiful-dnd'

import styled from '../styles/styled-components'
import TaskList from './TaskList'
import TaskAddition, { ConfirmData } from '../components/TaskAddition'
import { IGroup, ITask } from '../models'
import { default as TaskStore } from '../stores/TaskStore'

export interface Props {
  group: IGroup
  index: number
  onAddTask?: (
    data: ConfirmData,
    reset: (reopen?: boolean) => void,
    fromShortcut: boolean
  ) => void
  onClickTask?: (task: ITask) => void
  onFinishedChange?: (task: ITask) => void
  onRemoveGroup?: (group: IGroup) => void
  onEditGroup?: (group: IGroup, title: string) => void
  onSort?: ({ order, sortable, evt, remoteOrder, remoteSortable }: any) => void
}

export default function TaskGroup (props: Props) {
  const { group, index } = props

  const taskStore = React.useContext(TaskStore)

  const { id, title, tasks } = group

  const onAddTask = React.useCallback(
    async ({ groupId, content }: any) => {
      await taskStore.addTask(groupId, content, '', -1, [])
    },
    [id]
  )

  return (
    <Draggable draggableId={'group-' + id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Wrapper ref={provided.innerRef} {...provided.draggableProps}>
          <Container>
            <Header
              isDragging={snapshot.isDragging}
              {...provided.dragHandleProps}
            >
              <Title>
                <label>{title}</label>
                <span>&nbsp;({tasks.length})</span>
              </Title>
            </Header>
            <TaskList tasks={tasks} groupId={id} type='TASKLIST' />
            <TaskAddition groupId={id} onConfirm={onAddTask} />
          </Container>
        </Wrapper>
      )}
    </Draggable>
  )
}
const Wrapper = styled.div(() => ({
  marginRight: '20px',
  width: '300px',
  display: 'flex',
  flexDirection: 'column'
}))

const Container = styled.div(({ theme }) => ({
  background: theme.bg,
  boxShadow: theme.boxShadow
}))

const Header = styled.div<{ isDragging: boolean }>(({ isDragging }) => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: '40px'
}))

const Title = styled.div(({ theme }) => ({
  // opacity: edit ? 0 : 1,
  userSelect: 'none',
  color: theme.fg,
  // marginLeft: '10px',
  fontSize: '14px',
  height: '42px',
  lineHeight: '42px',
  textIndent: '10px',
  '&>label': {
    display: 'block',
    maxWidth: '230px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    float: 'left'
  },
  '&>span': {
    float: 'left'
  },
  '&~div': {
    // opacity: edit ? 0 : 1
  },
  '&~input': {
    background: theme.bg,
    position: 'absolute',
    left: '10px',
    // display: edit ? 'block' : 'none',
    width: '280px'
  }
}))

const Actions = styled.div(() => ({
  marginRight: '10px',
  '&:hover~div': {
    display: 'block'
  }
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
    display: 'block'
  }
}))

const Option = styled.div(() => ({
  cursor: 'pointer',
  '&:hover': {
    background: '#eee'
  }
}))
