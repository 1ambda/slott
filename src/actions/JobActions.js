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

export function removeJob(payload) {
  return { type: JobActionTypes.REMOVE, payload, }
}

export function sortJob(payload) {
  return { type: JobActionTypes.SORT, payload, }
}

export function filterJob(payload) {
  return { type: JobActionTypes.FILTER, payload, }
}

export function fetchJobs() {
  return { type: JobActionTypes.FETCH.REQUEST, }
}

export function fetchJobsSuccess(payload) {
  return { type: JobActionTypes.FETCH.SUCCESS, payload, }
}

export function fetchJobsFailure(payload) {
  return { type: JobActionTypes.FETCH.FAILURE, payload, }
}

