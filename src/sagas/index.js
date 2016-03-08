import { takeEvery, } from 'redux-saga'
import { take, put, call, fork, } from 'redux-saga/effects'

import * as ActionTypes from '../constants/ActionTypes'
import { job as JobActions, } from '../actions'

const JOB_TRANSITION_DELAY = 1000
const always = true

export function delay(millis) {
  return new Promise(resolve =>
    setTimeout(() => {
      console.log(1)
      resolve()
    }, millis)
  )
}

function* startJob(action) {
  while(always) {
    const { payload, } = yield take(ActionTypes.JOB_START)
    const { name, } = payload
    yield put(JobActions.enterTransition(name))
    yield put(JobActions.startJob(action))
    yield call(delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.exitTransition(name))
  }
}

function* stopJob(action) {
  while(always) {
    const { payload, } = yield take(ActionTypes.JOB_STOP)
    const { name, } = payload
    yield put(JobActions.enterTransition(name))
    yield put(JobActions.stopJob(name))
    yield call(delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.exitTransition(name))
  }
}


export default function* root() {
  yield fork(startJob)
  yield fork(stopJob)
}
