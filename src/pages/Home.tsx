import * as React from 'react'
import { Route } from 'react-router'

import styled from '../styles/theme'
import Dashboard from './Dashboard'
import TopBar from '../components/TopBar'
import Logo from '../components/Logo'
import Button from '../components/Button'
import SidePanel from '../components/SidePanel'
import DashboardItem from '../components/DashboardItem'

export interface IHomeProps {}

export interface IHomeState {}

export default class Home extends React.Component<IHomeProps, IHomeState> {

  public constructor (props: IHomeProps) {
    super(props)
    this.state = {}
  }

  public render () {
    const {} = this.props

    return (
      <Wrapper>
        <TopBar
          header={(
            <React.Fragment>
              <Button size='large' icon='Menu'/>
            </React.Fragment>
          )}
        >
          <Logo/>
        </TopBar>
        <Container>
          <SidePanel
            header={(
              <React.Fragment>
                <SidePanelTitle>Dashboards (4)</SidePanelTitle>
                <Button size='large' icon='Plus'/>
              </React.Fragment>
            )}
          >
            <DashboardItem active>Personal</DashboardItem>
            <DashboardItem active={false}>Work</DashboardItem>
            <DashboardItem active={false}>Team</DashboardItem>
            <DashboardItem active={false}>Others</DashboardItem>
          </SidePanel>
          <Route path='/dashboards/:dashboardId' component={Dashboard}/>
        </Container>
      </Wrapper>
    )
  }

}

const Wrapper = styled.div(({ theme }) => ({
  position: 'relative',
  paddingTop: '60px',
  height: '100%',
  color: theme.fg,
  background: theme.bgLight
}))

const Container = styled.div(() => ({
  position: 'relative',
  height: '100%'
}))

const SidePanelTitle = styled.div(() => ({
  flex: 1
}))
