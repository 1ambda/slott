import { createAction, handleActions, } from 'redux-actions'

import * as SorterState from './SorterState'
import * as FilterState from './FilterState'

export const JOB_STATE = {
  STOPPED: 'STOPPED', /** readonly */
  WAITING: 'WAITING',
  RUNNING: 'RUNNING',
}

export const JOB_PROPERTY = {
  state: 'state', /** array */
  switching: 'switching', /** boolean */
  id: 'id', /** string */
  tags: 'tags', /** array */
}

export const INITIAL_JOB_STATE = {
  id: '', tags: [], state: JOB_STATE.WAITING, switching: false,
}

export const isRunning = (job) => job[JOB_PROPERTY.state] === JOB_STATE.RUNNING
export const isStopped = (job) => job[JOB_PROPERTY.state] === JOB_STATE.STOPPED
export const isWaiting = (job) => job[JOB_PROPERTY.state] === JOB_STATE.WAITING

export const isSwitching = (job) => job[JOB_PROPERTY.switching]

export const modifyJobProp = (job, prop, value) =>
  Object.assign({}, job, {[prop]: value,})

export const modifyJobWithFilter = (state, filter, prop, value) =>
  state.map(job => {
    return (filter(job)) ? modifyJobProp(job, prop, value) : job
  })

export const replaceJobWithFilter = (state, filter, updatedJob) =>
  state.map(job => {
    return (filter(job)) ? updatedJob : job
  })

export const stopJob = (state, { payload, }) => {
  const filter = (job) => (payload.id === job[JOB_PROPERTY.id] && isRunning(job))
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.state, JOB_STATE.WAITING)
}

export const startJob = (state, { payload, }) => {
  const filter = (job) => (payload.id === job[JOB_PROPERTY.id] && isWaiting(job))
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.state, JOB_STATE.RUNNING)
}

export const updateJob = (state, { payload, }) => {
  const updatedJob = payload.job
  const filter = (job) => (updatedJob[JOB_PROPERTY.id] === job[JOB_PROPERTY.id])
  return replaceJobWithFilter(state, filter, updatedJob)
}

export const setReadonly = (state, { payload, }) => {
  const filter = (job) => (payload.id === job[JOB_PROPERTY.id] && isWaiting(job))
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.state, JOB_STATE.STOPPED)
}

export const unsetReadonly = (state, { payload, }) => {
  const filter = (job) => (payload.id === job[JOB_PROPERTY.id] && isStopped(job))
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.state, JOB_STATE.WAITING)
}

export const startSwitching = (state, { payload, }) => {
  const filter = (job) => (payload.id === job[JOB_PROPERTY.id])
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.switching, true)
}

export const endSwitching = (state, { payload, }) => {
  const filter = (job) => (payload.id === job[JOB_PROPERTY.id])
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.switching, false)
}

export const updateAllJobs = (state, { payload, }) => {
  return payload.jobs
}

export const stopAllJobs = (state) => {
  /** iff job is running */
  const filter = (job) => isRunning(job)
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.state, JOB_STATE.WAITING)
}

export const startAllJobs = (state) => {
  /** iff not running and not readonly */
  const filter = (job) => isWaiting(job)
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.state, JOB_STATE.RUNNING)
}

export function sortByRunning(job1, job2) {
  if (isRunning((job1)) && !isRunning(job2)) return -1
  else if (!isRunning(job1) && isRunning(job2)) return 1

  /** if both jobs are not running, enabled first  */
  if (!isStopped(job1) && isStopped(job2)) return -1
  else if (isStopped(job1) && !isStopped(job2)) return 1
  else return 0
}

export function sortByWaiting(job1, job2) {
  if (!isRunning(job1) && isRunning(job2)) return -1
  else if (isRunning(job1) && !isRunning(job2)) return 1

  /** if both jobs are not running, enabled first  */
  if (!isStopped(job1) && isStopped(job2)) return -1
  else if (isStopped(job1) && !isStopped(job2)) return 1
  else return 0
}

export function sortByStopped(job1, job2) {
  if (!isRunning(job1) && isRunning(job2)) return -1
  else if (isRunning(job1) && !isRunning(job2)) return 1

  /** if both jobs are not running */
  if (isStopped(job1) && !isStopped(job2)) return -1
  else if (!isStopped(job1) && isStopped(job2)) return 1
  else return 0
}

export function sortJob(state, { payload, }) {
  const jobs = state.slice() /** copy origin state */

  switch(payload.strategy) {
    case SorterState.RUNNING:
      return jobs.sort(sortByRunning)
    case SorterState.WAITING:
      return jobs.sort(sortByWaiting)
    case SorterState.STOPPED:
      return jobs.sort(sortByStopped)
  }

  return state
}

/** utils */

export function validateId(id) {
  /** validate id */
  if (id === void 0 || '' === id) {
    throw new Error('EMPTY ID')
  }
}

export function validateJobId(job) {

  /** if undefined or empty job*/
  if (job === void 0 || Object.keys(job).length === 0) {
    throw new Error('EMPTY JOB')
  }

  const id = job[JOB_PROPERTY.id] /** id might be undefined */

  validateId(id)

  return id
}

export function checkDuplicatedJob(id, existingJobs) {
  /** check already exists in client jobs */
  const alreadyExistingId = existingJobs.reduce((exist, job) => {
    return exist || id === job[JOB_PROPERTY.id]
  }, false)

  if (alreadyExistingId) {
    throw new Error(`DUPLICATED ID: ${id}`)
  }
}

export const ActionType = {
  START_SWITCHING: 'JOB_START_SWITCHING',
  END_SWITCHING: 'JOB_END_SWITCHING',
  UPDATE_ALL_JOBS: 'JOB_UPDATE_ALL_JOBS',
  UPDATE_JOB: 'JOB_UPDATE_JOB',
}

export const Action = {
  startSwitching: createAction(ActionType.START_SWITCHING),
  endSwitching: createAction(ActionType.END_SWITCHING),
  updateAllJobs: createAction(ActionType.UPDATE_ALL_JOBS),
  updateJob: createAction(ActionType.UPDATE_JOB),
}

const INITIAL_JOBS = []

export const handler = handleActions({
  /** client only */
  [ActionType.START_SWITCHING]: startSwitching,
  [ActionType.END_SWITCHING]: endSwitching,

  [SorterState.ActionType.SORT]: sortJob,

  /** api related */
  [ActionType.UPDATE_ALL_JOBS]: updateAllJobs,
  [ActionType.UPDATE_JOB]: updateJob,

}, INITIAL_JOBS)
