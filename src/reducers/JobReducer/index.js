import { combineReducers, } from 'redux'

import * as JobActionTypes from '../../constants/JobActionTypes'
import * as JobSortStrategies from '../../constants/JobSortStrategies'

import { EDITOR_DIALOG_MODE, } from '../../components/Common/EditorDialog'
import { CONFIRM_DIALOG_MODE, } from '../../components/Common/ConfirmDialog'
import * as Job from './job'

export function handleJobItems(state = [], action = null) {
  if (null == action) return state

  const { type, payload, } = action

  switch(type) {
    case JobActionTypes.FETCH_JOBS.SUCCEEDED:
      return payload.jobs /** return fetched new jobs */
      // TODO FETCH_JOBS.FAILED
    case JobActionTypes.START_SWITCHING:
      return Job.startSwitching(state, payload.id)
    case JobActionTypes.END_SWITCHING:
      return Job.endSwitching(state, payload.id)
    case JobActionTypes.SET_READONLY:
      return Job.setReadonly(state, payload.id)
    case JobActionTypes.UNSET_READONLY:
      return Job.unsetReadonly(state, payload.id)
    case JobActionTypes.STOP:
      return Job.stopJob(state, payload.id)
    case JobActionTypes.START:
      return Job.startJob(state, payload.id)
    case JobActionTypes.CREATE:
      return Job.createJob(state, payload.id, payload.config)
    case JobActionTypes.REMOVE:
      return Job.removeJob(state, payload.id)
    case JobActionTypes.SORT:
      return Job.sortJob(state, payload.strategy)
    case JobActionTypes.STOP_ALL:
      return Job.stopAllJobs(state)
    case JobActionTypes.START_ALL:
      return Job.startAllJobs(state)

    case JobActionTypes.FETCH_JOB_CONFIG.SUCCEEDED: /** update job config */
    case JobActionTypes.UPDATE_JOB_CONFIG.SUCCEEDED:
      return Job.updateConfig(state, payload.id, payload.config)
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

const INITIAL_EDITOR_DIALOG_STATE = {
  id: '',
  config: {},
  dialogMode:  EDITOR_DIALOG_MODE.CLOSE,
  readonly: true,
}

export function handleEditorDialog(state = INITIAL_EDITOR_DIALOG_STATE, action = null) {
  const { type, payload, } = action

  switch(type) {
    case JobActionTypes.FETCH_JOB_CONFIG.SUCCEEDED:
      return Object.assign({}, INITIAL_EDITOR_DIALOG_STATE, {
        id: payload.id,
        readonly: payload.readonly,
        dialogMode: EDITOR_DIALOG_MODE.EDIT,
        config: payload.config,
      })

    case JobActionTypes.OPEN_EDITOR_DIALOG_TO_CREATE:
      return Object.assign({}, INITIAL_EDITOR_DIALOG_STATE, {
        dialogMode: EDITOR_DIALOG_MODE.CREATE,
      })

    case JobActionTypes.CLOSE_EDITOR_DIALOG:
      return Object.assign({}, state, {
        dialogMode: EDITOR_DIALOG_MODE.CLOSE,
      })
  }

  return state
}

const INITIAL_CONFIRM_DIALOG_STATE = {
  job: {},
  dialogMode: CONFIRM_DIALOG_MODE.CLOSE,
}

export function handleConfirmDialog(state = INITIAL_CONFIRM_DIALOG_STATE, action = null) {
  const { type, payload, } = action

  switch(type) {
    case JobActionTypes.OPEN_CONFIRM_DIALOG_TO_ACTION_ALL:
      console.error('TODO: OPEN_CONFIRM_DIALOG_TO_ACTION_ALL in JobReducer')
      return state
    case JobActionTypes.OPEN_CONFIRM_DIALOG_TO_REMOVE:
      return Object.assign({}, state, { job: payload, dialogMode: CONFIRM_DIALOG_MODE.REMOVE, })
    case JobActionTypes.CLOSE_CONFIRM_DIALOG:
      return Object.assign({}, state, { dialogMode: CONFIRM_DIALOG_MODE.CLOSE, })
  }

  return state
}

export default combineReducers({
  items: handleJobItems,
  paginator: handleJobPaginator,
  filterKeyword: handleJobFilter,
  sortingStrategy: handleJobSorter,
  editorDialog: handleEditorDialog,
  confirmDialog: handleConfirmDialog,
})
