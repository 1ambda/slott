import { combineReducers, } from 'redux'

import * as JobActionTypes from '../constants/JobActionTypes'

const INITIAL_JOB_ITEMS = [
  {name: 'akka-cluster-00', config: {}, running: true, disabled: false, inTransition: false, },
  {name: 'akka-cluster-01', config: {}, running: false, disabled: false, inTransition: false, },
  {name: 'akka-cluster-02', config: {}, running: true, disabled: true, inTransition: false, },
  {name: 'spark-job-1', config: {}, running: true, disabled: false, inTransition: false, },
  {name: 'spark-job-2', config: {}, running: false, disabled: true, inTransition: false, },
  {name: 'spark-job-3', config: {}, running: true, disabled: false, inTransition: false, },
  {name: 'spark-job-4', config: {}, running: false, disabled: true, inTransition: false, },
  {name: 'spark-job-5', config: {}, running: true, disabled: false, inTransition: false, },
  {name: 'spark-job-6', config: {}, running: false, disabled: true, inTransition: false, },
  {name: 'daily-batch-0', config: {}, running: false, disabled: false, inTransition: false, },
  {name: 'daily-batch-1', config: {}, running: false, disabled: true, inTransition: false, },
  {name: 'daily-batch-2', config: {}, running: false, disabled: false, inTransition: false, },
]

const INITIAL_PAGINATOR_STATE = {
  currentPageOffset: 0,
  currentItemOffset: 0,
  itemCountPerPage: 8,
}

function editJob(state, prop, value, name) {
  return state.map(job => {
    return (job.name === name) ? Object.assign({}, job, {[prop]: value,}) : job
  })
}

export function handleJobItems(state = INITIAL_JOB_ITEMS, action = null) {
  if (null == action) return state

  const { type, payload, } = action

  switch(type) {
    case JobActionTypes.ENTER_TRANSITION:
      return editJob(state, 'inTransition', true, payload.name)
    case JobActionTypes.EXIT_TRANSITION:
      return editJob(state, 'inTransition', false, payload.name)
    case JobActionTypes.DISABLE:
      return editJob(state, 'disabled', true, payload.name)
    case JobActionTypes.ENABLE:
      return editJob(state, 'disabled', false, payload.name)
    case JobActionTypes.STOP:
      return editJob(state, 'running', false, payload.name)
    case JobActionTypes.START:
      return editJob(state, 'running', true, payload.name)
      // TODO remove, update
  }

  return state
}

export function handleJobPaginator(state = INITIAL_PAGINATOR_STATE, action = null) {

  const { type, payload, } = action

  switch(type) {
    case JobActionTypes.CHANGE_PAGE_OFFSET: {
      const { newPageOffset, } = payload
      const currentItemOffset = newPageOffset * state.itemCountPerPage
      const currentPageOffset = newPageOffset
      return Object.assign({}, state, { currentPageOffset, currentItemOffset, })
    }
  }

  return state
}

export default combineReducers({
  items: handleJobItems,
  paginator: handleJobPaginator,
})
