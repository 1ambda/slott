import React from 'react'
import { render, } from 'react-dom'
import { Provider, } from 'react-redux'
import { Router, Route, browserHistory, } from 'react-router'
import { syncHistoryWithStore, routerReducer, } from 'react-router-redux'

import routes from './routes'
import configureStore from './store/configureStore'

import './styles/styles.scss'

import 'isomorphic-fetch'

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

render(
  <Provider store={store}>
    <Router history={history} routes={routes} />
  </Provider>, document.getElementById('app')
)
