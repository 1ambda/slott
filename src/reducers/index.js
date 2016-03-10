import { combineReducers, } from 'redux'
import { routerReducer, } from 'react-router-redux'

import JobReducer from './JobReducer'

const rootReducer = combineReducers({
  job: JobReducer,
  routing: routerReducer,
})

export default rootReducer


