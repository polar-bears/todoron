import React, { useState } from 'react'
import styled, { ThemeProvider } from 'styled-components'
import { createBrowserHistory } from 'history'
import { Router } from 'react-router'

import MainView from './views/MainView'
import { GlobalStyles } from './styles'
import { lightTheme } from './styles/theme'

const history = createBrowserHistory()

export interface Props {}

export default function App (props: Props) {
  const [theme] = useState(lightTheme)

  return (
    <ThemeProvider theme={theme}>
      <Router history={history}>
        <Wrapper>
          <MainView />
          <GlobalStyles />
        </Wrapper>
      </Router>
    </ThemeProvider>
  )
}

const Wrapper = styled.div``
