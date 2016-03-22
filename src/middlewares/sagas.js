import { take, put, call, fork, } from 'redux-saga/effects'

import * as JobActions from '../actions/JobActions'
import * as JobActionTypes from '../constants/JobActionTypes'
import { sortJob, } from '../reducers/JobReducer/job'
import * as JobSortStrategies from '../constants/JobSortStrategies'
import * as API from './api'

const JOB_TRANSITION_DELAY = 1000

const always = true /** takeEvery does'n work. (redux-saga 0.9.5) */

/** fetch initial jobs */
function* initialize() {
  const { response, error, } = yield call(API.fetchJobs)

  if (error) yield put(JobActions.fetchJobsFailed({ error, }))
  else {
    const sortedJobs = sortJob(response, JobSortStrategies.INITIAL)
    yield put(JobActions.fetchJobsSucceeded({ jobs: sortedJobs, }))
  }
}

function* watchStartJob() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.START)
    yield put(JobActions.startSwitching(payload))
    yield put(JobActions.startJob(payload))
    yield call(API.delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.endSwitching(payload))
  }
}

function* watchStop() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.STOP)
    yield put(JobActions.startSwitching(payload))
    yield put(JobActions.stopJob(payload))
    yield call(API.delay, JOB_TRANSITION_DELAY)
    yield put(JobActions.endSwitching(payload))
  }
}

function* watchOpenEditorDialogToEdit() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT)
    const { id, } = payload
    const { response, error, } = yield call(API.fetchJobConfig, id)

    if (error) yield put(JobActions.fetchJobConfigFailed({ error, }))
    else {
      const payloadWithConfig = Object.assign({}, payload, { config: response, })
      yield put(JobActions.fetchJobConfigSucceeded(payloadWithConfig))
    }
  }
}

function* watchUpdateConfig() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.UPDATE_CONFIG)
    const { id, config, } = payload
    const { error, } = yield call(API.updateJobConfig, id, config)

    if (error) yield put(JobActions.updateJobConfigFailed({ id, error, }))
    else {
      yield call(initialize) /** update all jobs since `job.id` might be changed */
      const payloadWithConfig = Object.assign({}, payload)
      yield put(JobActions.updateJobConfigSucceeded(payloadWithConfig))
    }
  }
}

//function* watchCreateJob() {
//  while(always) {
//    const { payload, } = yield take(JobActionTypes.CREATE)
//    const { config, } = payload
//    const { response, error, } = yield call(API.createJob, config)
//  }
//}

function* watchRemoveJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.REMOVE)
    const { id, } = payload
    const { error, } = yield call(API.removeJob, id)

    if (error) yield put(JobActions.removeJobFailed({ id, error, }))
    else yield put(JobActions.removeJobSucceeded(payload))
  }
}

export default function* root() {
  yield fork(initialize)
  yield fork(watchStartJob)
  yield fork(watchStop)
  yield fork(watchOpenEditorDialogToEdit)
  yield fork(watchUpdateConfig)
  yield fork(watchRemoveJob)
  //yield fork(watchCreateJob)
}
