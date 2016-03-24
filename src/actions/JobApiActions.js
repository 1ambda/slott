import * as JobApiActionTypes from '../constants/JobApiActionTypes'
import { createAction, } from 'redux-actions'


/**
 * api calls for job item
 *
 * failure will be handled by openSnackbar actions
 */
export const fetchJobsSucceeded = createAction(JobApiActionTypes.FETCH_JOBS.SUCCEEDED)
export const removeJobSucceeded = createAction(JobApiActionTypes.REMOVE.SUCCEEDED)
export const createJobSucceeded = createAction(JobApiActionTypes.CREATE.SUCCEEDED)
export const fetchJobConfigSucceeded = createAction(JobApiActionTypes.FETCH_CONFIG.SUCCEEDED)
export const updateJobSucceeded = createAction(JobApiActionTypes.UPDATE.SUCCEEDED)
export const setReadonlySucceeded = createAction(JobApiActionTypes.SET_READONLY.SUCCEEDED)
export const unsetReadonlySucceeded = createAction(JobApiActionTypes.UNSET_READONLY.SUCCEEDED)
export const startJobSucceeded = createAction(JobApiActionTypes.START.SUCCEEDED)
export const stopJobSucceeded = createAction(JobApiActionTypes.STOP.SUCCEEDED)
