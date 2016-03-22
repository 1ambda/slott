import * as JobActionTypes from '../constants/JobActionTypes'
import { createAction, } from 'redux-actions'

/** for job item */
export const unsetReadonly = createAction(JobActionTypes.UNSET_READONLY)
export const setReadonly = createAction(JobActionTypes.SET_READONLY)
export const startJob = createAction(JobActionTypes.START)
export const stopJob = createAction(JobActionTypes.STOP)
export const startSwitching = createAction(JobActionTypes.START_SWITCHING)
export const endSwitching = createAction(JobActionTypes.END_SWITCHING)

export const createJob = createAction(JobActionTypes.CREATE)
export const removeJob = createAction(JobActionTypes.REMOVE)
export const updateConfig = createAction(JobActionTypes.UPDATE_CONFIG)

export const stopAllJobs = createAction(JobActionTypes.STOP_ALL)
export const startAllJobs = createAction(JobActionTypes.START_ALL)

/** sorter, filter, paginator */
export const sortJob = createAction(JobActionTypes.SORT)
export const filterJob = createAction(JobActionTypes.FILTER)
export const changePageOffset = createAction(JobActionTypes.CHANGE_PAGE_OFFSET)

/** for dialogs, snackbar */
export const openEditorDialogToEdit= createAction(JobActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT)
export const openEditorDialogToCreate= createAction(JobActionTypes.OPEN_EDITOR_DIALOG_TO_CREATE)
export const closeEditorDialog = createAction(JobActionTypes.CLOSE_EDITOR_DIALOG)
export const openConfirmDialogToRemove = createAction(JobActionTypes.OPEN_CONFIRM_DIALOG_TO_REMOVE)
export const closeConfirmDialog = createAction(JobActionTypes.CLOSE_CONFIRM_DIALOG)
export const openSnackbar = createAction(JobActionTypes.OPEN_SNACKBAR)
export const closeSnackbar = createAction(JobActionTypes.CLOSE_SNACKBAR)

/** api calls for job item */
export const fetchJobsSucceeded = createAction(JobActionTypes.API_FETCH_ALL.SUCCEEDED)
export const fetchJobsFailed = createAction(JobActionTypes.API_FETCH_ALL.FAILED)
export const removeJobSucceeded = createAction(JobActionTypes.API_REMOVE.SUCCEEDED)
export const removeJobFailed = createAction(JobActionTypes.API_REMOVE.FAILED)

/** api calls for job config */
export const fetchJobConfigSucceeded = createAction(JobActionTypes.API_FETCH_CONFIG.SUCCEEDED)
export const fetchJobConfigFailed = createAction(JobActionTypes.API_FETCH_CONFIG.FAILED)
export const updateJobConfigSucceeded = createAction(JobActionTypes.API_UPDATE_CONFIG.SUCCEEDED)
export const updateJobConfigFailed = createAction(JobActionTypes.API_UPDATE_CONFIG.FAILED)


