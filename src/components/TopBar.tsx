import * as React from 'react'

import styled from '../styles/styled-components'

export interface Props {
  className?: string
  header?: React.ReactNode
  footer?: React.ReactNode
  children?: React.ReactNode
}

export default function TopBar (props: Props) {
  const { className, header, footer, children } = props

  return (
    <Wrapper className={className}>
      <Header>{header}</Header>
      <Container>{children}</Container>
      <Footer>{footer}</Footer>
    </Wrapper>
  )
}

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
