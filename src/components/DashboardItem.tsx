import * as React from 'react'
import styled from '../styles/theme'
import Icon from './Icon'

export interface IDashboardItemProps {
  className?: string
  active?: boolean
}

export interface IDashboardItemState {}

export default class DashboardItem extends React.Component<IDashboardItemProps, IDashboardItemState> {

  public constructor (props: IDashboardItemProps) {
    super(props)
    this.state = {}
  }

  public render () {
    const { className, children, active = false } = this.props

    return (
      <Wrapper className={className} active={active}>
        <StyledIcon name='Inbox'/>
        <Content>{children}</Content>
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
  marginLeft: '10px',
}))
