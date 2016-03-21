import * as JobActionTypes from '../constants/JobActionTypes'

/** for job item */
export const unsetReadonly = (payload) => { return { type: JobActionTypes.UNSET_READONLY, payload, } }
export const setReadonly = (payload) => { return { type: JobActionTypes.SET_READONLY, payload, } }
export const startJob = (payload) => { return { type: JobActionTypes.START, payload, } }
export const stopJob = (payload) => { return { type: JobActionTypes.STOP, payload, } }
export const startSwitching = (payload) => { return { type: JobActionTypes.START_SWITCHING, payload, } }
export const endSwitching = (payload) => { return { type: JobActionTypes.END_SWITCHING, payload, } }

export const createJob = (payload) => { return { type: JobActionTypes.CREATE, payload, } }
export const removeJob = (payload) => { return { type: JobActionTypes.REMOVE, payload, } }
export const updateConfig = (payload) => { return { type: JobActionTypes.UPDATE_CONFIG, payload, } }
export const stopAllJobs = () => { return { type: JobActionTypes.STOP_ALL, } }
export const startAllJobs = () => { return { type: JobActionTypes.START_ALL, } }

/** sorter, filter, paginator */
export const sortJob = (payload) => { return { type: JobActionTypes.SORT, payload, } }
export const filterJob = (payload) => { return { type: JobActionTypes.FILTER, payload, } }
export const changePageOffset = (payload) => { return { type: JobActionTypes.CHANGE_PAGE_OFFSET, payload, } }

/** for dialogs */
export const openEditorDialogToEdit= (payload) =>
{ return { type: JobActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT, payload, } }
export const openEditorDialogToCreate= () =>
{ return { type: JobActionTypes.OPEN_EDITOR_DIALOG_TO_CREATE, } }
export const closeEditorDialog = () =>
{ return { type: JobActionTypes.CLOSE_EDITOR_DIALOG, } }
export const openConfirmDialogToRemove = (payload) =>
{ return { type: JobActionTypes.OPEN_CONFIRM_DIALOG_TO_REMOVE, payload, } }
export const openConfirmDialogToActionAll = (payload) =>
{ return { type: JobActionTypes.OPEN_CONFIRM_DIALOG_TO_ACTION_ALL, payload, } }
export const closeConfirmDialog = () =>
{ return { type: JobActionTypes.CLOSE_CONFIRM_DIALOG, } }

/** api calls for job item */
export const fetchJobsSucceeded = (payload) =>
{ return { type: JobActionTypes.FETCH_JOBS.SUCCEEDED, payload, } }
export const fetchJobsFailed = (payload) =>
{ return { type: JobActionTypes.FETCH_JOBS.FAILED, payload, } }

/** api calls for job config */
export const fetchJobConfigSucceeded = (payload) =>
{ return { type: JobActionTypes.FETCH_JOB_CONFIG.SUCCEEDED, payload, } }
export const fetchJobConfigFailed = (payload) =>
{ return { type: JobActionTypes.FETCH_JOB_CONFIG.FAILED, payload, } }
export const updateJobConfigSucceeded = (payload) =>
{ return { type: JobActionTypes.UPDATE_JOB_CONFIG.SUCCEEDED, payload, } }
export const updateJobConfigFailed = (payload) =>
{ return { type: JobActionTypes.UPDATE_JOB_CONFIG.FAILED, payload, } }



