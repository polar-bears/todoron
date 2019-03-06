import * as React from 'react'

import noop from '../libs/noop'
import styled from '../styles/styled-components'
import Icon from './Icon'
import { IBoard } from '../models'

export interface Props {
  className?: string
  active?: boolean
  board: IBoard
  onClick?: (board: IBoard) => void
  onDelete?: (boardId: number) => void
  onEdit?: (boardId: number) => void
}

export default function BoardItem (props: Props) {
  const {
    className,
    board,
    active = false,
    onClick = noop,
    onDelete = noop,
    onEdit = noop
  } = props

  const onBoardClick = () => {
    onClick(board)
  }

  const onBoardEdit = (e: React.MouseEvent) => {
    e.stopPropagation()

    onEdit()
  }

  const onBoardDelete = (e: React.MouseEvent) => {
    e.stopPropagation()

    onDelete()
  }

  return (
    <Wrapper className={className} active={active} onClick={onBoardClick}>
      <StyledIcon name='Inbox' />
      <Content>{board.title}</Content>
      <EditIcon name='Edit2' onClick={onBoardEdit} />
      <DelIcon name='Trash2' onClick={onBoardDelete} />
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
