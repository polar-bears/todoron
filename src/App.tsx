import * as React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'

import Home from './pages/Home'
import { lightTheme } from './styles/theme'

export interface IAppProps {}

export interface IAppState {}

export default class App extends React.Component<IAppProps, IAppState> {

  public constructor (props: IAppProps) {
    super(props)
    this.state = {}
  }

  public render () {
    const {} = this.props

    return (
      <ThemeProvider theme={lightTheme}>
        <Router>
          <Route path='/' component={Home}/>
        </Router>
      </ThemeProvider>
    )
  }

}
