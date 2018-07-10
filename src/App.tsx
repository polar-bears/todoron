import * as React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'
import { ThemeProvider } from 'emotion-theming'

import Home from './views/Home'
import { lightTheme } from './styles/theme'

export interface IAppProps {}

export interface IAppState {}

export default class App extends React.Component<IAppProps, IAppState> {

  public render () {
    return (
      <ThemeProvider theme={lightTheme}>
        <Router>
          <Route path='/' component={Home}/>
        </Router>
      </ThemeProvider>
    )
  }

}
