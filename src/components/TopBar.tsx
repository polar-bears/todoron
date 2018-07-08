import * as React from 'react'
import styled from '../styles/theme'

export interface ITopBarProps {
  header?: React.ReactNode
  footer?: React.ReactNode
}

export interface ITopBarState {}

export default class TopBar extends React.Component<ITopBarProps, ITopBarState> {

  public constructor (props: ITopBarProps) {
    super(props)
    this.state = {}
  }

  public render () {
    const { header, footer, children } = this.props

    return (
      <Wrapper>
        <Header>{header}</Header>
        <Container>{children}</Container>
        <Footer>{footer}</Footer>
      </Wrapper>
    )
  }

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

const Header = styled.div()

const Container = styled.div(() => ({
  flex: '1',
  textAlign: 'center'
}))

const Footer = styled.div()
