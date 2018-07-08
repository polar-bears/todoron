declare const module: any

import './styles/reset'
import './styles/global'

import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './App'

const render  = (Component: React.ComponentClass) => {
  ReactDOM.render(
    <Component/>,
    document.getElementById('root'),
  )
}

render(App)

if (module.hot) {
  module.hot.accept()
}
