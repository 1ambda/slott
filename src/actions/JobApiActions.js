import * as JobApiActionTypes from '../constants/JobApiActionTypes'
import { createAction, } from 'redux-actions'

export const fetchJobsSucceeded = createAction(JobApiActionTypes.FETCH_JOBS.SUCCEEDED)
export const removeJobSucceeded = createAction(JobApiActionTypes.REMOVE.SUCCEEDED)
export const createJobSucceeded = createAction(JobApiActionTypes.CREATE.SUCCEEDED)
export const fetchJobConfigSucceeded = createAction(JobApiActionTypes.FETCH_CONFIG.SUCCEEDED)
export const updateJobSucceeded = createAction(JobApiActionTypes.UPDATE.SUCCEEDED)
export const fetchContainerJobsSucceeded = createAction(JobApiActionTypes.FETCH_JOBS.SUCCEEDED)

/** for job item */
export const unsetReadonly = createAction(JobApiActionTypes.UNSET_READONLY.REQUESTED)
export const setReadonly = createAction(JobApiActionTypes.SET_READONLY.REQUESTED)
export const startJob = createAction(JobApiActionTypes.START.REQUESTED)
export const stopJob = createAction(JobApiActionTypes.STOP.REQUESTED)

export const createJob = createAction(JobApiActionTypes.CREATE.REQUESTED)
export const removeJob = createAction(JobApiActionTypes.REMOVE.REQUESTED)
export const updateJob = createAction(JobApiActionTypes.UPDATE.REQUESTED)

export const changeContainer = createAction(JobApiActionTypes.CHANGE_CONTAINER.REQUESTED)
export const openEditorDialogToEdit= createAction(JobApiActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT.REQUESTED)

/** not implemented yet */
export const stopAllJobs = createAction(JobApiActionTypes.STOP_ALL.REQUESTED)
export const startAllJobs = createAction(JobApiActionTypes.START_ALL.REQUESTED)

