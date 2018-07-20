import * as React from 'react'

import styled from '../styles/theme'
import Icon from './Icon'
import { IBoard } from '../models'

export interface IBoardItemProps {
  className?: string
  active?: boolean
  board: IBoard
  onClick?: (board: IBoard) => void
}

export interface IBoardItemState {}

export default class BoardItem extends React.Component<IBoardItemProps, IBoardItemState> {

  public constructor (props: IBoardItemProps) {
    super(props)
    this.state = {}
  }

  public onClick = () => {
    const { board, onClick } = this.props

    if (onClick) {
      onClick(board)
    }
  }

  public render () {
    const { className, board, active = false } = this.props

    return (
      <Wrapper className={className} active={active} onClick={this.onClick}>
        <StyledIcon name='Inbox'/>
        <Content>{board.title}</Content>
      </Wrapper>
    )
  }

}

const Wrapper = styled.div<{active: boolean}>(({ theme, active }) => ({
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
    background: active ? theme.bgDark : theme.bg,
  },
}))

const StyledIcon = styled(Icon)(({ theme }) => ({
  color: theme.fgLight,
}))

const Content = styled.div(() => ({
  marginLeft: '8px',
  flex: 1,
}))

const Actions = styled.div(() => ({
  marginLeft: '8px',
}))
