import { combineReducers, } from 'redux'
import { handleActions, } from 'redux-actions'

import * as JobActionTypes from '../../constants/JobActionTypes'
import * as JobSortStrategies from '../../constants/JobSortStrategies'

import { EDITOR_DIALOG_MODE, } from '../../components/Common/EditorDialog'
import { CONFIRM_DIALOG_MODE, } from '../../components/Common/ConfirmDialog'
import { CLOSABLE_SNACKBAR_MODE, } from '../../components/Common/ClosableSnackbar'
import * as Job from './job'

const INITIAL_JOBS = []

/** client related actions. */
export const handleJobItems = handleActions({
  [JobActionTypes.API_FETCH_ALL.SUCCEEDED]: Job.updateAllJobs,
  [JobActionTypes.API_FETCH.SUCCEEDED]: Job.updateJob,

  [JobActionTypes.START_SWITCHING]: Job.startSwitching,
  [JobActionTypes.END_SWITCHING]: Job.endSwitching,

  [JobActionTypes.API_UNSET_READONLY.SUCCEEDED]: Job.unsetReadonly,
  [JobActionTypes.API_SET_READONLY.SUCCEEDED]: Job.setReadonly,

  [JobActionTypes.API_UPDATE.SUCCEEDED]: Job.updateJob,
  [JobActionTypes.API_STOP.SUCCEEDED]: Job.stopJob,
  [JobActionTypes.API_START.SUCCEEDED]: Job.startJob,

  [JobActionTypes.SORT]: Job.sortJob,
  [JobActionTypes.STOP_ALL]: Job.stopAllJobs,
  [JobActionTypes.START_ALL]: Job.startAllJobs,

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
  job: {},
  dialogMode:  EDITOR_DIALOG_MODE.CLOSE,
  readonly: true,
}

export const handleEditorDialog = handleActions({
  /** open editor dialog to edit */
  [JobActionTypes.API_FETCH.SUCCEEDED]: (state, { payload, }) =>
    Object.assign({}, INITIAL_EDITOR_DIALOG_STATE, {
      id: payload.id,
      readonly: payload.readonly,
      dialogMode: EDITOR_DIALOG_MODE.EDIT,
      job: payload.filteredJob,
    }),

  [JobActionTypes.API_CREATE.SUCCEEDED]: (state, { payload, }) =>
    Object.assign({}, state, {
      id: payload.id,
      dialogMode: EDITOR_DIALOG_MODE.CLOSE,
    }),

  [JobActionTypes.OPEN_EDITOR_DIALOG_TO_CREATE]: () =>
    Object.assign({}, INITIAL_EDITOR_DIALOG_STATE, {
      dialogMode: EDITOR_DIALOG_MODE.CREATE,
    }),

  [JobActionTypes.CLOSE_EDITOR_DIALOG]: (state) =>
    Object.assign({}, INITIAL_EDITOR_DIALOG_STATE /** reset job */, {
      dialogMode: EDITOR_DIALOG_MODE.CLOSE,
      readonly: false,
    }),
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

const INITIAL_SNACKBAR_STATE = {
  snackbarMode: CLOSABLE_SNACKBAR_MODE.CLOSE,
  message: '',
}

export const handleClosableSnackbar = handleActions({
  /** snackbar related */
  [JobActionTypes.CLOSE_SNACKBAR]: (state) =>
    Object.assign({}, state, { snackbarMode: CLOSABLE_SNACKBAR_MODE.CLOSE, }),

  [JobActionTypes.OPEN_ERROR_SNACKBAR]: (state, { payload, }) =>
    Object.assign({}, state, {
      snackbarMode: CLOSABLE_SNACKBAR_MODE.OPEN,
      message: `[ERROR] ${payload.message} (${payload.error.message})`,
    }),

  [JobActionTypes.OPEN_INFO_SNACKBAR]: (state, { payload, }) =>
    Object.assign({}, state, {
      snackbarMode: CLOSABLE_SNACKBAR_MODE.OPEN,
      message: `[INFO] ${payload.message}`,
    }),

}, INITIAL_SNACKBAR_STATE)

export const JOB_STATE_PROPERTY = {
  JOB_ITEMS: 'items',
  PAGINATOR: 'paginator',
  FILTER: 'filterKeyword',
  EDITOR_DIALOG: 'editorDialog',
  CONFIRM_DIALOG: 'confirmDialog',
  SORTER: 'sortingStrategy',
  SNACKBAR: 'snackbar',
}

export default combineReducers({
  [JOB_STATE_PROPERTY.JOB_ITEMS]: handleJobItems,
  [JOB_STATE_PROPERTY.PAGINATOR]: handleJobPaginator,
  [JOB_STATE_PROPERTY.FILTER]: handleJobFilter,
  [JOB_STATE_PROPERTY.SORTER]: handleJobSorter,
  [JOB_STATE_PROPERTY.EDITOR_DIALOG]: handleEditorDialog,
  [JOB_STATE_PROPERTY.CONFIRM_DIALOG]: handleConfirmDialog,
  [JOB_STATE_PROPERTY.SNACKBAR]: handleClosableSnackbar,
})
