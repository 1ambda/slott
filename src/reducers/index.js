import { combineReducers, } from 'redux'
import jobState from './JobReducer'

const rootReducer = combineReducers({
  jobState,
})

export default rootReducer
