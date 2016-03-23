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
export const updateJob = createAction(JobActionTypes.UPDATE)

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
export const createJobSucceeded = createAction(JobActionTypes.API_CREATE.SUCCEEDED)
export const createJobFailed = createAction(JobActionTypes.API_CREATE.FAILED)

export const fetchJobSucceeded = createAction(JobActionTypes.API_FETCH.SUCCEEDED)
export const fetchJobFailed = createAction(JobActionTypes.API_FETCH.FAILED)
export const updateJobSucceeded = createAction(JobActionTypes.API_UPDATE.SUCCEEDED)
export const updateJobFailed = createAction(JobActionTypes.API_UPDATE.FAILED)

export const setReadonlySucceeded = createAction(JobActionTypes.API_SET_READONLY.SUCCEEDED)
export const setReadonlyFailed = createAction(JobActionTypes.API_SET_READONLY.FAILED)

export const unsetReadonlySucceeded = createAction(JobActionTypes.API_UNSET_READONLY.SUCCEEDED)
export const unsetReadonlyFailed = createAction(JobActionTypes.API_UNSET_READONLY.FAILED)

export const startJobSucceeded = createAction(JobActionTypes.API_START.SUCCEEDED)
export const startJobFailed = createAction(JobActionTypes.API_START.FAILED)

export const stopJobSucceeded = createAction(JobActionTypes.API_STOP.SUCCEEDED)
export const stopJobFailed = createAction(JobActionTypes.API_STOP.FAILED)

