import * as ActionTypes from '../constants/ActionTypes'

export function disableJob(name) {
  return { type: ActionTypes.JOB_DISABLE, payload: { name, }, }
}

export function enableJob(name) {
  return { type: ActionTypes.JOB_ENABLE, payload: { name, }, }
}

export function startJob(name) {
  return { type: ActionTypes.JOB_START, payload: { name, }, }
}

export function stopJob(name) {
  return { type: ActionTypes.JOB_STOP, payload: { name, }, }
}

export function enterTransition(name) {
  return { type: ActionTypes.JOB_ENTER_TRANSITION, payload: { name, }, }
}

export function exitTransition(name) {
  return { type: ActionTypes.JOB_EXIT_TRANSITION, payload: { name, }, }
}


// TODO remove, fetch
