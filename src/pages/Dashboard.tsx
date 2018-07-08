import * as React from 'react'
import styled from 'react-emotion'

export interface IDashboardProps {}

export interface IDashboardState {}

export default class Dashboard extends React.Component<IDashboardProps, IDashboardState> {

  public constructor (props: IDashboardProps) {
    super(props)
    this.state = {}
  }

  public render () {
    const {} = this.props

    return (
      <Wrapper>Dashboard</Wrapper>
    )
  }

}

const Wrapper = styled.div()
