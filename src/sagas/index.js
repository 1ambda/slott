import { takeEvery, } from 'redux-saga'
import { take, put, call, fork, } from 'redux-saga/effects'

import * as JobActions from '../actions/JobActions'
import * as JobActionTypes from '../constants/JobActionTypes'
import { sortJob, } from '../reducers/JobReducer'
import * as JobSortStrategies from '../constants/JobSortStrategies'
import * as api from './api'

const JOB_TRANSITION_DELAY = 1000
const always = true

export function delay(millis) {
  return new Promise(resolve => setTimeout(() => { resolve() }, millis))
}

/** fetch initial jobs */
function* initialize() {
  const { response, error, } = yield call(api.fetchJobs)

  if (error) yield put(JobActions.fetchJobsFailure({ error, }))
  else {
    const sortedJobs = sortJob(response, JobSortStrategies.INITIAL)
    yield put(JobActions.fetchJobsSuccess({ jobs: sortedJobs, }))
  }
}

function* watchStartJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.START)
    yield put(JobActions.enterTransition(payload))
    yield put(JobActions.startJob(payload))
    yield call(delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.exitTransition(payload))
  }
}

function* watchStartJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.STOP)
    yield put(JobActions.enterTransition(payload))
    yield put(JobActions.stopJob(payload))
    yield call(delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.exitTransition(payload))
  }
}

export default function* () {
  yield fork(initialize)
  yield fork(watchStartJob)
  yield fork(watchStartJob)
}
