import { combineReducers, } from 'redux'
import { handleActions, } from 'redux-actions'

import * as JobActionTypes from '../../constants/JobActionTypes'
import * as JobSortStrategies from '../../constants/JobSortStrategies'

import { EDITOR_DIALOG_MODE, } from '../../components/Common/EditorDialog'
import { CONFIRM_DIALOG_MODE, } from '../../components/Common/ConfirmDialog'
import * as Job from './job'

const INITIAL_JOBS = []

export const handleJobItems = handleActions({
  [JobActionTypes.API_FETCH_JOBS.SUCCEEDED]: (state, { payload, }) =>
    payload.jobs,

  [JobActionTypes.API_FETCH_JOBS.FAILED]: (state, action) =>
    console.error(`TODO: failed to fetch jobs`),

  [JobActionTypes.START_SWITCHING]: (state, { payload, }) =>
    Job.startSwitching(state, payload.id),

  [JobActionTypes.END_SWITCHING]: (state, { payload, }) =>
    Job.endSwitching(state, payload.id),

  [JobActionTypes.UNSET_READONLY]: (state, { payload, }) =>
    Job.unsetReadonly(state, payload.id),

  [JobActionTypes.SET_READONLY]: (state, { payload, }) =>
    Job.setReadonly(state, payload.id),

  [JobActionTypes.STOP]: (state, { payload, }) =>
    Job.stopJob(state, payload.id),

  [JobActionTypes.START]: (state, { payload, }) =>
    Job.startJob(state, payload.id),

  [JobActionTypes.CREATE]: (state, { payload, }) =>
    Job.createJob(state, payload.id, payload.config),

  [JobActionTypes.SORT]: (state, { payload, }) =>
    Job.sortJob(state, payload.strategy),

  [JobActionTypes.STOP_ALL]: (state) =>
    Job.stopAllJobs(state),

  [JobActionTypes.START_ALL]: (state) =>
    Job.startAllJobs(state),

  [JobActionTypes.API_FETCH_JOB_CONFIG.SUCCEEDED]: (state, { payload, }) =>
    Job.updateConfig(state, payload.id, payload.config),

  [JobActionTypes.API_UPDATE_JOB_CONFIG.SUCCEEDED]: (state, { payload, }) =>
    Job.updateConfig(state, payload.id, payload.config),

  [JobActionTypes.API_REMOVE_JOB.SUCCEEDED]: (state, { payload, }) =>
    Job.removeJob(state, payload.id),

}, INITIAL_JOBS)

const INITIAL_PAGINATOR_STATE = {
  currentPageOffset: 0,
  currentItemOffset: 0,
  itemCountPerPage: 8,
}

const handleJobPaginator = handleActions({
  [JobActionTypes.CHANGE_PAGE_OFFSET]: (state, { payload, }) => {
    const { newPageOffset, } = payload
    const currentItemOffset = newPageOffset * state.itemCountPerPage
    return Object.assign({}, state, {currentPageOffset: newPageOffset, currentItemOffset,})
  },

  /** reset paginator if filter or sorter action is occurred */
  [JobActionTypes.SORT]: (state) => INITIAL_PAGINATOR_STATE,
  [JobActionTypes.FILTER]: (state) => INITIAL_PAGINATOR_STATE,
}, INITIAL_PAGINATOR_STATE)


export const handleJobFilter = handleActions({
  [JobActionTypes.FILTER]: (state, { payload, }) =>
    payload.filterKeyword, /** string is immutable */
}, '' /** initial state of filterKeyworld */)

export const handleJobSorter = handleActions({
  [JobActionTypes.SORT]: (state, { payload, }) => /** string is immutable */
    payload.strategy,
}, JobSortStrategies.INITIAL)

const INITIAL_EDITOR_DIALOG_STATE = {
  id: '',
  config: {},
  dialogMode:  EDITOR_DIALOG_MODE.CLOSE,
  readonly: true,
}

export const handleEditorDialog = handleActions({
  [JobActionTypes.API_FETCH_JOB_CONFIG.SUCCEEDED]: (state, { payload, }) =>
    Object.assign({}, INITIAL_EDITOR_DIALOG_STATE, {
      id: payload.id,
      readonly: payload.readonly,
      dialogMode: EDITOR_DIALOG_MODE.EDIT,
      config: payload.config,
    }),

  [JobActionTypes.OPEN_EDITOR_DIALOG_TO_CREATE]: () =>
    Object.assign({}, INITIAL_EDITOR_DIALOG_STATE, { dialogMode: EDITOR_DIALOG_MODE.CREATE, }),

  [JobActionTypes.CLOSE_EDITOR_DIALOG]: (state) =>
    Object.assign({}, state, { dialogMode: EDITOR_DIALOG_MODE.CLOSE, }),
}, INITIAL_EDITOR_DIALOG_STATE)

const INITIAL_CONFIRM_DIALOG_STATE = {
  job: {},
  dialogMode: CONFIRM_DIALOG_MODE.CLOSE,
}

export const handleConfirmDialog = handleActions({
  [JobActionTypes.OPEN_CONFIRM_DIALOG_TO_ACTION_ALL]: (state, { payload, }) =>
    console.error('TODO: OPEN_CONFIRM_DIALOG_TO_ACTION_ALL in JobReducer'),

  [JobActionTypes.OPEN_CONFIRM_DIALOG_TO_REMOVE]: (state, { payload, }) =>
    Object.assign({}, state, { job: payload, dialogMode: CONFIRM_DIALOG_MODE.REMOVE, }),

  [JobActionTypes.CLOSE_CONFIRM_DIALOG]: (state, { payload, }) =>
    Object.assign({}, state, { dialogMode: CONFIRM_DIALOG_MODE.CLOSE, }),

}, INITIAL_CONFIRM_DIALOG_STATE)

export default combineReducers({
  items: handleJobItems,
  paginator: handleJobPaginator,
  filterKeyword: handleJobFilter,
  sortingStrategy: handleJobSorter,
  editorDialog: handleEditorDialog,
  confirmDialog: handleConfirmDialog,
})
