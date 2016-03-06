import { createStore, applyMiddleware, combineReducers, } from 'redux'
import { routerReducer, } from 'react-router-redux'

import * as reducers from '../reducers'

const middlewares = []

export default function configureStore(initialState) {
  return createStore(
    combineReducers({
      ...reducers,
      routing: routerReducer,
    }),
    initialState,
    applyMiddleware(...middlewares)
  )
}
