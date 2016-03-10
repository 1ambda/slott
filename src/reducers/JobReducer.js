import { combineReducers, } from 'redux'

import * as JobActionTypes from '../constants/JobActionTypes'

const INITIAL_JOBS = [
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

function editJob(state, prop, value, name) {
  return state.map(job => {
    return (job.name === name) ? Object.assign({}, job, {[prop]: value,}) : job
  })
}

function removeJob(state, name) {
  return state.filter(job => job.name !== name)
}

export function handleJobItems(state = INITIAL_JOBS, action = null) {
  if (null == action) return state

  const { type, payload, } = action

  if (!type.startsWith('EFFECT') && !type.startsWith('@@')) {
    console.log(type)
    console.log(payload)
  }

  switch(type) {
    case JobActionTypes.ENTER_TRANSITION:
      return editJob(state, 'inTransition', true, payload)
    case JobActionTypes.EXIT_TRANSITION:
      return editJob(state, 'inTransition', false, payload)
    case JobActionTypes.DISABLE:
      return editJob(state, 'disabled', true, payload)
    case JobActionTypes.ENABLE:
      return editJob(state, 'disabled', false, payload)
    case JobActionTypes.STOP:
      return editJob(state, 'running', false, payload)
    case JobActionTypes.START:
      return editJob(state, 'running', true, payload)
      // TODO remove, update
  }

  return state
}

export function handleJobPaginator(state = {}, action = null) {
  return state
}

export default combineReducers({
  items: handleJobItems,
  paginator: handleJobPaginator,
})
