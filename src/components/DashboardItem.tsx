import * as React from 'react'
import styled from '../styles/theme'
import Icon from './Icon'

export interface IDashboardItemProps {
  active: boolean
}

export interface IDashboardItemState {}

export default class DashboardItem extends React.Component<IDashboardItemProps, IDashboardItemState> {

  public constructor (props: IDashboardItemProps) {
    super(props)
    this.state = {}
  }

  public render () {
    const { active, children } = this.props

    return (
      <Wrapper active={active}>
        <StyledIcon name='Inbox'/>
        <Content>{children}</Content>
      </Wrapper>
    )
  }

}

const Wrapper = styled.div<{active: boolean}>(({ active, theme }) => ({
  marginBottom: '8px',
  padding: '0 10px',
  display: 'flex',
  alignItems: 'center',
  height: '36px',
  cursor: 'pointer',
  color: active ? theme.fgDark : theme.fgLight,
  background: active ? theme.bgDark : 'transparent',
  borderRadius: theme.borderRadius,
  transition: 'background 0.3s, color 0.3s',
  '&:hover': {
    color: active ? theme.fgDark : theme.fg,
    background: active ? theme.bgDark : theme.bg,
  }
}))

const StyledIcon = styled(Icon)(({ theme }) => ({
  color: theme.fgLight
}))

const Content = styled.div(() => ({
  marginLeft: '10px'
}))
