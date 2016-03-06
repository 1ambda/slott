import React from 'react'
import { render, } from 'react-dom'
import { Provider, } from 'react-redux'
import { Router, Route, browserHistory, } from 'react-router'
import { syncHistoryWithStore, routerReducer, } from 'react-router-redux'

/** initialize */
import 'isomorphic-fetch'
import injectTapEventPlugin from 'react-tap-event-plugin'
injectTapEventPlugin()

import routes from './routes'
import configureStore from './store/configureStore'

import './styles/styles.scss'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>, document.getElementById('app')
)
