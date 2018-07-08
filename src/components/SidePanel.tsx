import * as React from 'react'

import styled from '../styles/theme'

export interface ISidePanelProps {
  header?: React.ReactNode
}

export interface ISidePanelState {}

export default class SidePanel extends React.Component<ISidePanelProps, ISidePanelState> {

  public constructor (props: ISidePanelProps) {
    super(props)
    this.state = {}
  }

  public render () {
    const { header, children } = this.props

    return (
      <Wrapper>
        {header && <Header>{header}</Header>}
        <Container>{children}</Container>
      </Wrapper>
    )
  }

}

const Wrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  zIndex: 5,
  top: 0,
  left: 0,
  width: '300px',
  height: '100%',
  background: theme.bgLighter,
  boxShadow: theme.boxShadow
}))

const Header = styled.div(({ theme }) => ({
  padding: '0 15px',
  display: 'flex',
  alignItems: 'center',
  height: '60px',
  borderBottom: theme.border
}))

const Container = styled.div(() => ({
  padding: '15px',
  flex: 1,
  overflowY: 'auto'
}))
