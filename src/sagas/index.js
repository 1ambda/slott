import { takeEvery, } from 'redux-saga'
import { take, put, call, fork, } from 'redux-saga/effects'

import * as JobActionTypes from '../constants/JobActionTypes'
import * as JobActions from '../actions/JobActions'

const JOB_TRANSITION_DELAY = 1000
const always = true

export function delay(millis) {
  return new Promise(resolve => setTimeout(() => { resolve() }, millis))
}

function* startJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.START)
    yield put(JobActions.enterTransition(payload))
    yield put(JobActions.startJob(payload))
    yield call(delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.exitTransition(payload))
  }
}

function* stopJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.STOP)
    yield put(JobActions.enterTransition(payload))
    yield put(JobActions.stopJob(payload))
    yield call(delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.exitTransition(payload))
  }
}

export default function* () {
  yield fork(startJob)
  yield fork(stopJob)
}
