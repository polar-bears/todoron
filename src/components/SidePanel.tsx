import * as React from 'react'

import styled from '../styles/styled-components'
import ScrollArea from './ScrollArea'

export interface ISidePanelProps {
  className?: string
  header?: React.ReactNode
  headerExtra?: React.ReactNode
  expanded?: boolean
}

const SidePanel: React.SFC<ISidePanelProps> = ({
  className,
  header,
  headerExtra,
  children,
  expanded = false
}) => {
  return (
    <Wrapper className={className} expanded={expanded}>
      {header && <Header>{header}</Header>}
      {headerExtra && <HeaderExtra>{headerExtra}</HeaderExtra>}
      <StyledScrollArea>
        <Container>{children}</Container>
      </StyledScrollArea>
    </Wrapper>
  )
}
export default SidePanel

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

const StyledScrollArea = styled(ScrollArea)(() => ({
  flex: 1
}))

const Container = styled.div(() => ({
  padding: '15px'
}))
