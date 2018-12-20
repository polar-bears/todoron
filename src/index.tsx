import React from 'react'
import ReactDOM from 'react-dom'

import * as serviceWorker from './serviceWorker'
import App from './App'

declare const module: any

const render = (Component: React.ComponentClass) => {
  ReactDOM.render(
    <Component/>,
    document.getElementById('root'),
  )
}

render(App)

if (module.hot) {
  module.hot.accept()
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
