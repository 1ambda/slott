import { createStore, applyMiddleware, combineReducers, } from 'redux'
import { routerReducer, } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'

import * as reducers from '../reducers'
import sagas from '../sagas'
const sagaMiddleware = createSagaMiddleware(sagas)

const middlewares = [sagaMiddleware,]

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
