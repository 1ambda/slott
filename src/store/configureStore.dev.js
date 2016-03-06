import { createStore, applyMiddleware, compose, combineReducers, } from 'redux'
import { routerReducer, } from 'react-router-redux'

import * as reducers from '../reducers'

const middlewares = []

export default function configureStore(initialState) {
  let store
  if (window.devToolsExtension) {
    store = createStore(
      combineReducers({
        ...reducers,
        routing: routerReducer,
      }),
      initialState,
      compose(
        applyMiddleware(...middlewares),
        window.devToolsExtension ? window.devToolsExtension() : f => f
      ))
  } else {
    store = createStore(
      combineReducers({
        ...reducers,
        routing: routerReducer,
      }),
      initialState,
      applyMiddleware(...middlewares)
    )
  }

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
