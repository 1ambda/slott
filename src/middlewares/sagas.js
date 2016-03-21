import { take, put, call, fork, } from 'redux-saga/effects'

import * as JobActions from '../actions/JobActions'
import * as JobActionTypes from '../constants/JobActionTypes'
import { sortJob, convertServerJobToClientJob, } from '../reducers/JobReducer/job'
import * as JobSortStrategies from '../constants/JobSortStrategies'
import * as api from './api'

const JOB_TRANSITION_DELAY = 1000

const always = true /** takeEvery does'n work. (redux-saga 0.9.5) */

/** fetch initial jobs */
function* initialize() {
  const { response, error, } = yield call(api.fetchJobs)

  if (error) yield put(JobActions.fetchJobsFailed({ error, }))
  else {
    const converted = response.map(convertServerJobToClientJob)
    const sortedJobs = sortJob(converted, JobSortStrategies.INITIAL)
    yield put(JobActions.fetchJobsSucceeded({ jobs: sortedJobs, }))
  }
}

function* watchStartJob() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.START)
    yield put(JobActions.startSwitching(payload))
    yield put(JobActions.startJob(payload))
    yield call(api.delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.endSwitching(payload))
  }
}

function* watchStop() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.STOP)
    yield put(JobActions.startSwitching(payload))
    yield put(JobActions.stopJob(payload))
    yield call(api.delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.endSwitching(payload))
  }
}

function* watchOpenEditorDialogToEdit() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT)
    const { id, } = payload
    const { response, error, } = yield call(api.fetchJobConfig, id)

    if (error) yield put(JobActions.fetchJobConfigFailed({ error, }))
    else {
      const payloadWithConfig = Object.assign({}, payload, { config: response, })
      yield put(JobActions.fetchJobConfigSucceeded(payloadWithConfig))
    }
  }
}

export default function* root() {
  yield fork(initialize)
  yield fork(watchStartJob)
  yield fork(watchStop)
  yield fork(watchOpenEditorDialogToEdit)
}
