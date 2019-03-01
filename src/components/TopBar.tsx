import * as React from 'react'

import styled from '../styles/styled-components'

export interface ITopBarProps {
  className?: string
  header?: React.ReactNode
  footer?: React.ReactNode
}

const TopBar: React.SFC<ITopBarProps> = ({
  className,
  header,
  footer,
  children
}) => {
  return (
    <Wrapper className={className}>
      <Header>{header}</Header>
      <Container>{children}</Container>
      <Footer>{footer}</Footer>
    </Wrapper>
  )
}

export default TopBar

const Wrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  zIndex: 10,
  top: 0,
  left: 0,
  padding: '0 10px',
  display: 'flex',
  alignItems: 'center',
  height: '60px',
  width: '100%',
  background: theme.bgLighter,
  boxShadow: theme.boxShadow
}))

const Header = styled.div({})

const Container = styled.div(() => ({
  flex: '1',
  textAlign: 'center'
}))

const Footer = styled.div({})
