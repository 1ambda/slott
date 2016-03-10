import * as JobActionTypes from '../constants/JobActionTypes'

export function disableJob(payload) {
  return { type: JobActionTypes.DISABLE, payload, }
}

export function enableJob(payload) {
  return { type: JobActionTypes.ENABLE, payload, }
}

export function startJob(payload) {
  return { type: JobActionTypes.START, payload, }
}

export function stopJob(payload) {
  return { type: JobActionTypes.STOP, payload, }
}

export function enterTransition(payload) {
  return { type: JobActionTypes.ENTER_TRANSITION, payload, }
}

export function exitTransition(payload) {
  return { type: JobActionTypes.EXIT_TRANSITION, payload, }
}

export function changePageOffset(payload) {
  return { type: JobActionTypes.CHANGE_PAGE_OFFSET, payload, }
}


// TODO remove, fetch
