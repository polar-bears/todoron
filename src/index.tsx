import './styles/reset'
import './styles/global'

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { create } from 'rxjs-spy'

import App from './App'

declare const module: any

const spy = create()

spy.log('boards$')
spy.log('board$')
spy.log('groups$')
spy.log('tags$')

const render  = (Component: React.ComponentClass) => {
  ReactDOM.render(
    <Component/>,
    document.getElementById('root'),
  )
}

render(App)

if (module.hot) {
  spy.teardown()
  module.hot.accept()
}
