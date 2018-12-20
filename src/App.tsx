import 'github-markdown-css'
import 'highlight.js/styles/solarized-light.css'

import * as React from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'

import GlobalStyle from './styles/globalStyles'
import ResetStyle from './styles/reset'
import HomeView from './views/HomeView'
import { ThemeProvider } from './styles/styled-components'
import { lightTheme } from './styles/theme'

export interface IAppProps { }
export interface IAppState {
  theme: object
}

export default class App extends React.Component<IAppProps, IAppState> {

  public state = {
    theme: lightTheme,
  }

  public render () {
    return (
      <ThemeProvider theme={lightTheme}>
        <React.Fragment>
          <ResetStyle />
          <GlobalStyle />
          <Router>
            <Route path='/' component={HomeView}/>
          </Router>
        </React.Fragment>
      </ThemeProvider>
    )
  }
}
