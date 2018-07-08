import * as React from 'react'

import styled from '../styles/theme'

export interface IGroupProps {
  className?: string
  title?: React.ReactNode
  actions?: React.ReactNode
}

export interface IGroupState {}

export default class Group extends React.Component<IGroupProps, IGroupState> {

  public render () {
    const { className, title, actions, children } = this.props

    return (
      <Wrapper className={className}>
        <Header>
          <Title>{title}</Title>
          <Actions>{actions}</Actions>
        </Header>
        <Container>{children}</Container>
      </Wrapper>
    )
  }

}

const Wrapper = styled.div(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  width: '300px',
  maxHeight: '100%',
  background: theme.bg,
  boxShadow: theme.boxShadow,
}))

const Header = styled.div(() => ({
  padding: '0 10px',
  display: 'flex',
  alignItems: 'center',
  minHeight: '40px',
}))

const Title = styled.div(({ theme }) => ({
  flex: 1,
  color: theme.fg,
  fontSize: '14px',
}))

const Actions = styled.div()

const Container = styled.div(() => ({
  padding: '10px',
  flex: '1',
  overflowY: 'auto',
}))
