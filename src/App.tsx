import * as React from 'react'
import { ThemeProvider } from 'styled-components'
import { createBrowserHistory } from 'history'
import { Route, Router } from 'react-router'

import MainView from './views/MainView'
import { GlobalStyles } from './styles/reset'
import { lightTheme } from './styles/theme'

import 'github-markdown-css'
import 'highlight.js/styles/solarized-light.css'

const history = createBrowserHistory()

export interface Props {}

export default function App (props: Props) {
  const [theme] = React.useState(lightTheme)

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <React.Fragment>
          <Route component={(routeProps: any) => <MainView {...routeProps}/>} />
          <GlobalStyles />
        </React.Fragment>
      </Router>
    </ThemeProvider>
  )
}
