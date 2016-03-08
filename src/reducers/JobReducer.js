import { combineReducer, } from 'redux'

import * as ActionTypes from '../constants/ActionTypes'

const INITIAL_JOBS = [
  {name: 'tmap-tsg', config: {}, running: true, disabled: false, inTransition: false, },
  {name: '11st-ch-encrypted', config: {}, running: false, disabled: false, inTransition: false, },
  {name: 'rake-metric', config: {}, running: true, disabled: true, inTransition: false, },
]

function editJob(state, prop, value, name) {
  return state.map(job => {
    return (job.name === name) ? Object.assign({}, job, {[prop]: value,}) : job
  })
}

function removeJob(state, name) {
  return state.filter(job => job.name !== name)
}

export default function JobReducer(state = INITIAL_JOBS, action = null) {
  if (null == action) return state

  const { type, payload, } = action

  switch(type) {
    case ActionTypes.JOB_ENTER_TRANSITION:
      return editJob(state, 'inTransition', true, payload.name)
    case ActionTypes.JOB_EXIT_TRANSITION:
      return editJob(state, 'inTransition', false, payload.name)
    case ActionTypes.JOB_DISABLE:
      return editJob(state, 'disabled', true, payload.name)
    case ActionTypes.JOB_ENABLE:
      return editJob(state, 'disabled', false, payload.name)
    case ActionTypes.JOB_STOP:
      return editJob(state, 'running', false, payload.name)
    case ActionTypes.JOB_START:
      return editJob(state, 'running', true, payload.name)
      // TODO remove, update
  }

  return state
}
