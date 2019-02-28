import * as React from 'react'
import styled from 'styled-components'
import { createBrowserHistory } from 'history'
import { Router } from 'react-router'

import MainView from './views/MainView'
import { GlobalStyles } from './styles'

const history = createBrowserHistory()

export interface Props {}

export default function App (props: Props) {
  return (
    <Router history={history}>
      <Wrapper>
        <MainView />
        <GlobalStyles />
      </Wrapper>
    </Router>
  )
}

const Wrapper = styled.div``
