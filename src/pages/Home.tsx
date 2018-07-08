import * as React from 'react'
import { Route, RouteComponentProps } from 'react-router'

import styled from '../styles/theme'
import Dashboard from './Dashboard'
import TopBar from '../components/TopBar'
import Logo from '../components/Logo'
import Button from '../components/Button'
import SidePanel from '../components/SidePanel'
import DashboardItem from '../components/DashboardItem'

export interface IHomeProps extends RouteComponentProps<{}> {}

export interface IHomeState {
  expanded: boolean
}

export default class Home extends React.Component<IHomeProps, IHomeState> {

  public constructor (props: IHomeProps) {
    super(props)

    this.state = {
      expanded: false,
    }

    if (this.props.location.pathname === '/') {
      this.props.history.push('/dashboards/default')
    }
  }

  public onToggle = () => {
    this.setState({ expanded: !this.state.expanded })
  }

  public render () {
    const { expanded } = this.state

    return (
      <Wrapper>
        <TopBar
          header={(
            <React.Fragment>
              <Button
                size='large'
                icon={expanded ? 'ArrowLeft' : 'Menu'}
                onClick={this.onToggle}
              />
            </React.Fragment>
          )}
        >
          <Logo/>
        </TopBar>
        <Container expanded={expanded}>
          <SidePanel
            expanded={expanded}
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
  background: theme.bgLight,
}))

const Container = styled.div<{expanded: boolean}>(({ expanded }) => ({
  paddingLeft: expanded ? '300px' : 0,
  position: 'relative',
  height: '100%',
  transition: 'padding-left 0.3s ease',
}))

const SidePanelTitle = styled.div(() => ({
  flex: 1,
}))
