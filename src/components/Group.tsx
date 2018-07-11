import * as React from 'react'

import styled from '../styles/theme'

export interface IGroupProps {
  className?: string
  header?: React.ReactNode
  title?: React.ReactNode
  actions?: React.ReactNode
  footer?: React.ReactNode
}

export interface IGroupState {}

export default class Group extends React.Component<IGroupProps, IGroupState> {

  public render () {
    const { className, header, title, actions, children, footer } = this.props

    return (
      <Wrapper className={className}>
        <Header>
          {header || (
            <React.Fragment>
              <Title>{title}</Title>
              <Actions>{actions}</Actions>
            </React.Fragment>
          )}
        </Header>
        <Container>{children}</Container>
        {footer && (
          <Footer>{footer}</Footer>
        )}
      </Wrapper>
    )
  }

}

const Wrapper = styled.div(({ theme }) => ({
  marginRight: '10px',
  display: 'inline-flex',
  flexDirection: 'column',
  width: '300px',
  maxHeight: '100%',
  background: theme.bg,
  boxShadow: theme.boxShadow,
}))

const Header = styled.div(() => ({
  display: 'flex',
  alignItems: 'center',
  minHeight: '40px',
}))

const Title = styled.div(({ theme }) => ({
  marginLeft: '10px',
  flex: 1,
  color: theme.fg,
  fontSize: '14px',
}))

const Actions = styled.div(() => ({
  marginRight: '10px',
}))

const Container = styled.div(() => ({
  flex: '1',
  overflowY: 'auto',
  '&:not(:empty)': {
    padding: '10px',
  },
}))

const Footer = styled.div()
