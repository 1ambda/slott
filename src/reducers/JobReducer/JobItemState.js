import { handleActions, } from 'redux-actions'

import * as JobActionTypes from '../../constants/JobActionTypes'
import * as JobApiActionTypes from '../../constants/JobApiActionTypes'

import * as Job from './job'

const INITIAL_JOBS = []

export const handler = handleActions({
  /** client only */
  [JobActionTypes.START_SWITCHING]: Job.startSwitching,
  [JobActionTypes.END_SWITCHING]: Job.endSwitching,
  [JobActionTypes.SORT]: Job.sortJob,

  /** api related */
  [JobApiActionTypes.FETCH_JOBS.SUCCEEDED]: Job.updateAllJobs,
  [JobApiActionTypes.UPDATE.SUCCEEDED]: Job.updateJob,

  // TODO
  [JobActionTypes.STOP_ALL]: (state) => {
    console.error(`TODO ${JobActionTypes.STOP_ALL} in JobReducer`)
    // Job.stopAllJobs,
    return state
  },

  [JobActionTypes.START_ALL]: (state) => {
    console.error(`TODO ${JobActionTypes.START_ALL} in JobReducer`)
    // Job.startAllJobs,
    return state
  },

}, INITIAL_JOBS)
