import { createStore, applyMiddleware, combineReducers, } from 'redux'
import { routerReducer, } from 'react-router-redux'
import createSagaMiddleware from 'redux-saga'

import RootReducer from '../reducers'
import Saga from '../middlewares/Saga'
const sagaMiddleware = createSagaMiddleware()

const middlewares = [sagaMiddleware,]

export default function configureStore(initialState) {

  const store = createStore(
    RootReducer,
    initialState,
    applyMiddleware(...middlewares)
  )

  sagaMiddleware.run(Saga)

  return store
}
