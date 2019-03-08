import * as React from 'react'

import noop from '../libs/noop'
import styled from '../styles/styled-components'
import Icon from './Icon'
import { IBoard } from '../models'
import Input from './Input'

export interface Props {
  className?: string
  active?: boolean
  editing?: boolean
  board: IBoard
  onToggleEditBoard?: () => void
  onClick?: (board: IBoard) => void
  onDelete?: (boardId: number) => void
  onEdit?: (boardId: number, newValue: string) => void
}

export default function BoardItem (props: Props) {
  const {
    className,
    board,
    active = false,
    editing = false,
    onClick = noop,
    onDelete = noop,
    onEdit = noop,
    onToggleEditBoard = noop
  } = props

  const [value, setValue] = React.useState(board.title)

  const onBoardClick = React.useCallback(() => {
    onClick(board)
  }, [])

  const onBoardEditing = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {

    let newBoardName = e.currentTarget.value

    if (newBoardName !== '') { board.title = newBoardName }

    onEdit(board.id, newBoardName)
  }, [])

  const onBoardDelete = React.useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete(board.id)
  }, [])

  const onValueChange = React.useCallback((newValue: string) => {
    setValue(newValue)
  }, [])

  return (
    <Wrapper className={className} active={active} onClick={onBoardClick}>
      <StyledIcon name='Inbox' />
      {editing ? (
        <StyledInput
          autoFocus
          value={value}
          onEnter={onBoardEditing}
          onBlur={onToggleEditBoard}
          onChange={onValueChange}
        />
      ) : (
        <React.Fragment>
          <Content>{board.title}</Content>
          <EditIcon name='Edit2' onClick={onToggleEditBoard} />
          <DelIcon name='Trash2' onClick={onBoardDelete} />
        </React.Fragment>
      )}
    </Wrapper>
  )
}

const Wrapper = styled.div<{ active: boolean }>(({ theme, active }) => ({
  marginBottom: '8px',
  padding: '0 10px',
  display: 'flex',
  alignItems: 'center',
  height: '36px',
  width: '100%',
  cursor: 'pointer',
  fontSize: '14px',
  color: active ? theme.fgDark : theme.fgLight,
  background: active ? theme.bgDark : 'transparent',
  borderRadius: theme.borderRadius,
  userSelect: 'none',
  transition: 'background 0.3s, color 0.3s',
  '&:hover': {
    color: active ? theme.fgDark : theme.fg,
    background: active ? theme.bgDark : theme.bg
  }
}))

const StyledInput = styled(Input)(({ theme }) => ({
  flex: 1,
  '&:focus': {
    background: theme.bgDark
  }
}))

const StyledIcon = styled(Icon)(({ theme }) => ({
  color: theme.fgLight
}))

const EditIcon = styled(Icon)(({ theme }) => ({
  color: theme.fgLight,
  marginRight: '10px',
  '&:hover': {
    color: theme.colors.green
  }
}))

const DelIcon = styled(Icon)(({ theme }) => ({
  color: theme.fgLight,
  '&:hover': {
    color: theme.colors.red
  }
}))

const Content = styled.div(() => ({
  marginLeft: '8px',
  flex: 1
}))
