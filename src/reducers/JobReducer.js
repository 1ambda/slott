import { combineReducers, } from 'redux'

import * as JobActionTypes from '../constants/JobActionTypes'
import * as JobSortStrategies from '../constants/JobSortStrategies'


const INITIAL_SORT_STRATEGY = JobSortStrategies.RUNNING

const JOB_ITEMS = [
  { name: 'akka-cluster-00',
    tags: ['cluster',], config: {},
    running: true, disabled: false, inTransition: false, },
  { name: 'akka-cluster-01',
    tags: ['cluster',], config: {},
    running: false, disabled: false, inTransition: false, },
  { name: 'akka-remote-01',
    tags: ['remote',], config: {},
    running: true, disabled: false, inTransition: false, },
  { name: 'hourly-batch-1',
    tags: ['batch', 'hourly',], config: {},
    running: false, disabled: false, inTransition: false, },
  { name: 'storm-job-1',
    tags: ['streaming',], config: {},
    running: true, disabled: false, inTransition: false, },
  { name: 'storm-job-2',
    tags: ['streaming',], config: {},
    running: false, disabled: true, inTransition: false, },
  { name: 'daily-batch-0',
    tags: ['batch', 'daily',], config: {},
    running: false, disabled: false, inTransition: false, },
  { name: 'spark-job-0',
    tags: ['micro batch',], config: {},
    running: true, disabled: false, inTransition: false, },
  { name: 'spark-streaming-0',
    tags: ['streaming',], config: {},
    running: false, disabled: true, inTransition: false, },
  { name: 'spark-streaming-5',
    tags: ['streaming',], config: {},
    running: true, disabled: false, inTransition: false, },
  { name: 'storm-trident-3',
    tags: ['trident', 'streaming', ], config: {},
    running: false, disabled: true, inTransition: false, },
  { name: 'daily-batch-1',
    tags: ['batch', 'daily',], config: {},
    running: false, disabled: true, inTransition: false, },
  { name: 'hourly-batch-0',
    tags: ['batch', 'hourly',], config: {},
    running: false, disabled: false, inTransition: false, },
]

const INITIAL_PAGINATOR_STATE = {
  currentPageOffset: 0,
  currentItemOffset: 0,
  itemCountPerPage: 8,
}

export function editJob(state, prop, value, name) {
  return state.map(job => {
    return (job.name === name) ? Object.assign({}, job, {[prop]: value,}) : job
  })
}

export function sortByRunning(job1, job2) {
  if (job1.running && !job2.running) return -1
  else if (!job1.running && job2.running) return 1

  /** if both jobs are not running, enabled first  */
  if (!job1.disabled && job2.disabled) return -1
  else if (job1.disabled && !job2.disabled) return 1
  else return 0
}

export function sortByWaiting(job1, job2) {
  if (!job1.running && job2.running) return -1
  else if (job1.running && !job2.running) return 1

  /** if both jobs are not running, enabled first  */
  if (!job1.disabled && job2.disabled) return -1
  else if (job1.disabled && !job2.disabled) return 1
  else return 0
}

export function sortByDisabled(job1, job2) {
  if (job1.running && !job2.running) return 1
  else if (!job1.running && job2.running) return -1

  /** if both jobs are not running */
  if (job1.disabled && !job2.disabled) return -1
  else if (!job1.disabled && job2.disabled) return 1
  else return 0
}

export function sortJob(state, strategy) {
  const jobs = state.slice() /** copy origin state */

  switch(strategy) {
    case JobSortStrategies.RUNNING:
      return jobs.sort(sortByRunning)
    case JobSortStrategies.WAITING:
      return jobs.sort(sortByWaiting)
    case JobSortStrategies.DISABLED:
      return jobs.sort(sortByDisabled)
  }

  return state
}

const INITIAL_JOB_ITEMS = sortJob(JOB_ITEMS, INITIAL_SORT_STRATEGY)

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
    case JobActionTypes.REMOVE:
      console.log(`TODO: ${JobActionTypes.REMOVE}`)
      return state
    case JobActionTypes.SORT:
      return sortJob(state, payload.strategy)
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

    /** reset paginator if filter or sorter action is occurred */
    case JobActionTypes.SORT:
    case JobActionTypes.FILTER:
      return INITIAL_PAGINATOR_STATE
  }

  return state
}

export function handleJobFilter(state = '', action = null) {
  const { type, payload, } = action

  switch(type) {
    case JobActionTypes.FILTER:
      return payload.filterKeyword /** string is immutable */
  }

  return state
}

export function handleJobSorter(state = INITIAL_SORT_STRATEGY, action = null) {
  const { type, payload, } = action

  switch(type) {
    case JobActionTypes.SORT:
      return payload.strategy /** string is immutable */
  }

  return state
}

export default combineReducers({
  items: handleJobItems,
  paginator: handleJobPaginator,
  filterKeyword: handleJobFilter,
  sortingStrategy: handleJobSorter,
})
