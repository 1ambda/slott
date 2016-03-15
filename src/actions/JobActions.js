import * as JobActionTypes from '../constants/JobActionTypes'

/** for job item */
export const enableJob = (payload) => { return { type: JobActionTypes.ENABLE, payload, } }
export const disableJob = (payload) => { return { type: JobActionTypes.DISABLE, payload, } }
export const startJob = (payload) => { return { type: JobActionTypes.START, payload, } }
export const stopJob = (payload) => { return { type: JobActionTypes.STOP, payload, } }
export const enterTransition = (payload) => { return { type: JobActionTypes.ENTER_TRANSITION, payload, } }
export const exitTransition = (payload) => { return { type: JobActionTypes.EXIT_TRANSITION, payload, } }
export const removeJob = (payload) => { return { type: JobActionTypes.REMOVE, payload, } }
export const stopAllJobs = () => { return { type: JobActionTypes.STOP_ALL, } }
export const startAllJobs = () => { return { type: JobActionTypes.START_ALL, } }

/** sorter, filter, paginator */
export const sortJob = (payload) => { return { type: JobActionTypes.SORT, payload, } }
export const filterJob = (payload) => { return { type: JobActionTypes.FILTER, payload, } }
export const changePageOffset = (payload) => { return { type: JobActionTypes.CHANGE_PAGE_OFFSET, payload, } }

/** for config dialog */
export const openConfigDialog = (payload) => { return { type: JobActionTypes.OPEN_CONFIG_DIALOG, payload, } }
export const closeConfigDialog = () => { return { type: JobActionTypes.CLOSE_CONFIG_DIALOG, } }

/** api calls for job item */
export const fetchJobs = () => { return { type: JobActionTypes.FETCH.REQUEST, } }
export const fetchJobsSuccess = (payload) => { return { type: JobActionTypes.FETCH.SUCCESS, payload, } }
export const fetchJobsFailure = (payload) => { return { type: JobActionTypes.FETCH.FAILURE, payload, } }

