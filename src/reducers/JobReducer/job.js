
import * as JobActionTypes from '../../constants/JobActionTypes'
import * as JobSortStrategies from '../../constants/JobSortStrategies'

export const JOB_STATE = {
  STOPPED: 'STOPPED', /** readonly */
  WAITING: 'WAITING',
  RUNNING: 'RUNNING',
}

export const JOB_PROPERTY = {
  state: 'state', /** array */
  switching: 'switching', /** boolean */
  name: 'name', /** string */
  tags: 'tags', /** array */
  config: 'config', /** object */
}

export const isRunning = (job) => job[JOB_PROPERTY.state] === JOB_STATE.RUNNING
export const isStopped = (job) => job[JOB_PROPERTY.state] === JOB_STATE.STOPPED
export const isWaiting = (job) => job[JOB_PROPERTY.state] === JOB_STATE.WAITING

export const isSwitching = (job) => job[JOB_PROPERTY.switching]

export const modifyJob = (job, prop, value) =>
  Object.assign({}, job, {[prop]: value,})

export const modifyJobWithFilter = (state, filter, prop, value) =>
  state.map(job => {
    return (filter(job)) ? modifyJob(job, prop, value) : job
  })

export const removeJobByFilter = (state, filter) =>
  state.filter(job => !filter(job))

export const stopJob = (state, name) => {
  const filter = (job) => (name === job[JOB_PROPERTY.name] && isRunning(job))
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.state, JOB_STATE.WAITING)
}

export const startJob = (state, name) => {
  const filter = (job) => (name === job[JOB_PROPERTY.name] && isWaiting(job))
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.state, JOB_STATE.RUNNING)
}

export const setReadonly = (state, name) => {
  const filter = (job) => (name === job[JOB_PROPERTY.name] && isWaiting(job))
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.state, JOB_STATE.STOPPED)
}

export const unsetReadonly = (state, name) => {
  const filter = (job) => (name === job[JOB_PROPERTY.name] && isStopped(job))
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.state, JOB_STATE.WAITING)
}

export const startSwitching = (state, name) => {
  const filter = (job) => (name === job[JOB_PROPERTY.name]) // TODO, more elaborate conditions
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.switching, true)
}

export const endSwitching = (state, name) => {
  const filter = (job) => (name === job[JOB_PROPERTY.name]) // TODO, more elaborate conditions
  return modifyJobWithFilter(state, filter, JOB_PROPERTY.switching, false)
}

export const removeJob = (state, name) => {
  const filter = (job) => (name === job[JOB_PROPERTY.name] && !(isRunning(job) || isStopped(job)))
  return removeJobByFilter(state, filter)
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

export function sortJob(state, strategy) {
  const jobs = state.slice() /** copy origin state */

  switch(strategy) {
    case JobSortStrategies.RUNNING:
      return jobs.sort(sortByRunning)
    case JobSortStrategies.WAITING:
      return jobs.sort(sortByWaiting)
    case JobSortStrategies.STOPPED:
      return jobs.sort(sortByStopped)
  }

  return state
}
