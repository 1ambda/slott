import { combineReducers, } from 'redux'

import * as JobActionTypes from '../../constants/JobActionTypes'
import * as JobSortStrategies from '../../constants/JobSortStrategies'

import * as Job from './job'

export function handleJobItems(state = [], action = null) {
  if (null == action) return state

  const { type, payload, } = action

  switch(type) {
    case JobActionTypes.FETCH.SUCCESS:
      return payload.jobs /** return fetched new jobs */
    case JobActionTypes.START_SWITCHING:
      return Job.startSwitching(state, payload.name)
    case JobActionTypes.END_SWITCHING:
      return Job.endSwitching(state, payload.name)
    case JobActionTypes.SET_READONLY:
      return Job.setReadonly(state, payload.name)
    case JobActionTypes.UNSET_READONLY:
      return Job.unsetReadonly(state, payload.name)
    case JobActionTypes.STOP:
      return Job.stopJob(state, payload.name)
    case JobActionTypes.START:
      return Job.startJob(state, payload.name)
    case JobActionTypes.REMOVE:
      return Job.removeJob(state, payload.name)
    case JobActionTypes.SORT:
      return Job.sortJob(state, payload.strategy)
    case JobActionTypes.STOP_ALL:
      return Job.stopAllJobs(state)
    case JobActionTypes.START_ALL:
      return Job.startAllJobs(state)
  }

  return state
}

const INITIAL_PAGINATOR_STATE = {
  currentPageOffset: 0,
  currentItemOffset: 0,
  itemCountPerPage: 8,
}

export function handleJobPaginator(state = INITIAL_PAGINATOR_STATE, action = null) {

  const { type, payload, } = action

  switch(type) {
    case JobActionTypes.CHANGE_PAGE_OFFSET: {
      const { newPageOffset, } = payload
      const currentItemOffset = newPageOffset * state.itemCountPerPage
      return Object.assign({}, state, { currentPageOffset: newPageOffset, currentItemOffset, })
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

export function handleJobSorter(state = JobSortStrategies.INITIAL, action = null) {
  const { type, payload, } = action

  switch(type) {
    case JobActionTypes.SORT:
      return payload.strategy /** string is immutable */
  }

  return state
}

const INITIAL_CONFIG_DIALOG_STATE = {
  title: '',
  opened: false,
  readonly: true,
  config: {},
}

export function handleConfigDialog(state = INITIAL_CONFIG_DIALOG_STATE, action = null) {
  const { type, payload, } = action

  switch(type) {
    case JobActionTypes.OPEN_CONFIG_DIALOG:
      return Object.assign({}, state, {
        title: payload.name, opened: true, readonly: payload.readonly, config: payload.config,
      })

    case JobActionTypes.CLOSE_CONFIG_DIALOG:
      return Object.assign({}, state, {
        opened: false,
      })
  }

  return state
}

export default combineReducers({
  items: handleJobItems,
  paginator: handleJobPaginator,
  filterKeyword: handleJobFilter,
  sortingStrategy: handleJobSorter,
  configDialog: handleConfigDialog,
})
