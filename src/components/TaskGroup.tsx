import * as React from 'react'
import { Draggable, DraggableProvided, DraggableStateSnapshot, Droppable, DroppableProvided } from 'react-beautiful-dnd'

import noop from '../libs/noop'
import styled from '../styles/styled-components'
import Icon from './Icon'
import Input from './Input'
import TaskCard from './TaskCard'
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
}

export default function TaskGroup (props: Props) {
  const { group, index, onClickTask = noop } = props

  const taskStore = React.useContext(TaskStore)

  const { id, tasks } = group

  const [title, setTitle] = React.useState(group.title)
  const [editable, setEditable] = React.useState(false)

  const onAddTask = React.useCallback(
    async ({ groupId, content }: ConfirmData) => {
      await taskStore.addTask(groupId, content, '', -1, [])
    },
    [id]
  )

  const onClick = React.useCallback((task: ITask) => {
    onClickTask(task)
  }, [])

  const onFinishedChange = React.useCallback(async (task: ITask) => {
    await taskStore.updateTask(task.id, { finished: !task.finished })
  }, [])

  const onRemoveGroup = React.useCallback(async () => {
    await taskStore.removeGroup(id)
  }, [id])

  const onEditGroup = React.useCallback(async () => {
    await taskStore.updateGroup(group.id, { title })
    setEditable(!editable)
  }, [title, editable])

  const onValueChange = React.useCallback(
    (newValue: string) => {
      setTitle(newValue)
    },
    [title]
  )

  const onToggleEdit = React.useCallback(() => {
    setEditable(!editable)
  }, [editable])

  return (
    <Draggable draggableId={'group-' + id} index={index}>
      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
        <Wrapper ref={provided.innerRef} {...provided.draggableProps}>
          <Container>
            <Header
              isDragging={snapshot.isDragging}
              {...provided.dragHandleProps}
            >
              {editable ? (
                <StyledInput
                  autoFocus
                  value={title}
                  onEnter={onEditGroup}
                  onBlur={onToggleEdit}
                  onChange={onValueChange}
                />
              ) : (
                <Title>
                  <Label>
                    {group.title}&nbsp;({tasks.length})
                  </Label>
                  <IconWrapper>
                    <EditIcon size='small' name='Edit' onClick={onToggleEdit} />
                  </IconWrapper>
                  <IconWrapper>
                    <DelIcon
                      size='small'
                      name='Trash2'
                      onClick={onRemoveGroup}
                    />
                  </IconWrapper>
                </Title>
              )}
            </Header>
            <Droppable type='TASKLIST' droppableId={'' + id}>
              {(dropProvided: DroppableProvided) => (
                <DropWrapper {...dropProvided.droppableProps}>
                  <DropZone ref={dropProvided.innerRef}>
                    {tasks.map((task: ITask, _index: number) => (
                      <Draggable
                        key={task.id}
                        draggableId={'task-' + task.id}
                        index={_index}
                      >
                        {(dragProvided: DraggableProvided) => (
                          <TaskWrapper
                            ref={dragProvided.innerRef}
                            {...dragProvided.draggableProps}
                          >
                            <TaskCard
                              key={task.id}
                              task={task}
                              index={index}
                              onClick={onClick}
                              onFinishedChange={onFinishedChange}
                              {...dragProvided.dragHandleProps}
                            />
                          </TaskWrapper>
                        )}
                      </Draggable>
                    ))}
                    {dropProvided.placeholder}
                  </DropZone>
                </DropWrapper>
              )}
            </Droppable>
            <TaskAddition groupId={id} onConfirm={onAddTask} />
          </Container>
        </Wrapper>
      )}
    </Draggable>
  )
}

const DropWrapper = styled.div(() => ({}))

const TaskWrapper = styled.div(() => ({}))

const DropZone = styled.div(() => ({
  overflowX: 'hidden',
  minHeight: '80px',
  maxHeight: '600px'
}))

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

const StyledInput = styled(Input)(() => ({
  flex: 1
}))

const IconWrapper = styled.div(() => ({}))

const EditIcon = styled(Icon)(({ theme }) => ({
  cursor: 'default',
  color: theme.fgLight,
  '&:hover': {
    color: theme.colors.green
  }
}))

const DelIcon = styled(Icon)(({ theme }) => ({
  cursor: 'default',
  color: theme.fgLight,
  '&:hover': {
    color: theme.colors.red
  }
}))

const Title = styled.div(({ theme }) => ({
  userSelect: 'none',
  color: theme.fg,
  fontSize: '14px',
  height: '42px',
  lineHeight: '42px',
  textIndent: '10px',
  display: 'flex',
  alignItems: 'center',
  width: '100%'
}))

const Label = styled.label(() => ({
  cursor: 'grab',
  display: 'block',
  maxWidth: '220px',
  marginRight: '10px',
  flex: 1,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap'
}))
