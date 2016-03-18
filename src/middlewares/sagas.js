import { takeEvery, } from 'redux-saga'
import { take, put, call, fork, } from 'redux-saga/effects'

import * as JobActions from '../actions/JobActions'
import * as JobActionTypes from '../constants/JobActionTypes'
import { sortJob, } from '../reducers/JobReducer/job'
import * as JobSortStrategies from '../constants/JobSortStrategies'
import * as api from './api'

const JOB_TRANSITION_DELAY = 1000
const always = true

// TODO: global error page
// TODO: remove, start/stop, enable/disable api
// TODO config, json editor

/** fetch initial jobs */
function* initialize() {
  const { response, error, } = yield call(api.fetchJobs)

  if (error) yield put(JobActions.fetchJobsFailed({ error, }))
  else {
    const sortedJobs = sortJob(response, JobSortStrategies.INITIAL)
    yield put(JobActions.fetchJobsSucceeded({ jobs: sortedJobs, }))
  }
}

function* watchStartJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.START)
    yield put(JobActions.startSwitching(payload))
    yield put(JobActions.startJob(payload))
    yield call(api.delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.endSwitching(payload))
  }
}

function* watchStop() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.STOP)
    yield put(JobActions.startSwitching(payload))
    yield put(JobActions.stopJob(payload))
    yield call(api.delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.endSwitching(payload))
  }
}

export default function* () {
  yield fork(initialize)
  yield fork(watchStartJob)
  yield fork(watchStop)
}
