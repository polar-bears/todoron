import * as React from 'react'

import styled from '../styles/styled-components'

export interface Props {
  className?: string
  header?: React.ReactNode
  headerExtra?: React.ReactNode
  expanded?: boolean
  children?: React.ReactNode
}

export default function SidePanel (props: Props) {
  const { className, header, headerExtra, expanded = false, children } = props

  return (
    <Wrapper className={className} expanded={expanded}>
      {header && <Header>{header}</Header>}
      {headerExtra && <HeaderExtra>{headerExtra}</HeaderExtra>}
      <Container>{children}</Container>
    </Wrapper>
  )
}

const Wrapper = styled.div<{ expanded: boolean }>(({ theme, expanded }) => ({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  zIndex: 5,
  top: 0,
  left: 0,
  width: '300px',
  height: '100%',
  background: theme.bgLighter,
  boxShadow: theme.boxShadow,
  transform: expanded ? 'translateX(0)' : 'translateX(-300px)',
  transition: 'transform 0.3s ease'
}))

const Header = styled.div(({ theme }) => ({
  padding: '0 15px',
  display: 'flex',
  alignItems: 'center',
  height: '60px',
  borderBottom: theme.border
}))

const HeaderExtra = styled.div({})

const Container = styled.div(() => ({
  padding: '15px',
  overflow: 'auto',
  flex: 1
}))
