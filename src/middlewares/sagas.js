import { take, put, call, fork, select, } from 'redux-saga/effects'

import * as JobActions from '../actions/JobActions'
import * as JobActionTypes from '../constants/JobActionTypes'
import * as JobApiActions from '../actions/JobApiActions'
import * as JobApiActionTypes from '../constants/JobApiActionTypes'

import {
  sortJob, JOB_PROPERTY, validateId, validateJobId, checkDuplicatedJob,
} from '../reducers/JobReducer/job'
import * as JobSortStrategies from '../constants/JobSortStrategies'
import * as API from './api'
import * as Selectors from '../reducers/JobReducer/selector'

export const JOB_TRANSITION_DELAY = 1000
export const always = true /** takeEvery does'n work. (redux-saga 0.9.5) */

/**
 * watcher utils
 *
 */

/** fetch all jobs, used to initialize  */
export function* callFetchJobs() {
  const jobs = yield call(API.fetchJobs)

  yield put(JobApiActions.fetchJobsSucceeded({ jobs, }))
  yield put(JobActions.sortJob({ strategy: JobSortStrategies.INITIAL, }))
}

/**
 * watcher functions
 *
 * every watcher should catch exceptions in while loop
 */
export function* watchOpenEditorDialogToEdit() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT)
    const { id, readonly, } = payload

    try {
      const job = yield call(API.fetchJobConfig, id)
      yield put(JobApiActions.fetchJobConfigSucceeded({ id, readonly, job, }))
    } catch (error) {
      yield put(JobActions.openErrorSnackbar({ message: `Failed to fetch job '${id}`, error, }))
    }
  }
}

export function* watchUpdateJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.UPDATE)
    const { id, job, } = payload

    try {
      const updatedJob = yield call(API.updateJob, id, job)
      yield put(JobApiActions.updateJobSucceeded({ id, job: updatedJob, }))
      yield put(JobActions.openInfoSnackbar({ message: `${id} was updated`, }))
    } catch (error) {
      yield put(JobActions.openErrorSnackbar({ message: `Failed to update job '${id}`, error, }))
    }
  }
}

export function* watchCreateJob() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.CREATE)
    const { job, } = payload

    try {
      /** validate */
      const id = validateJobId(job)
      const existingJobs = yield select(Selectors.getJobItems)
      checkDuplicatedJob(job, existingJobs)

      yield call(API.createJob, job) /** create job */
      yield call(callFetchJobs)      /** fetch all jobs again */
      yield put(JobActions.closeEditorDialog())
      yield put(JobActions.openInfoSnackbar({ message: `${id} was created`, }))
    } catch (error) {
      yield put(JobActions.openErrorSnackbar(
        { message: `Failed to create job`, error, }))
    }
  }
}

export function* watchRemoveJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.REMOVE)
    const { id, } = payload

    try {
      validateId(id)
      yield call(API.removeJob, id)
      yield call(callFetchJobs) /** fetch all job again */
      yield put(JobActions.openInfoSnackbar({ message: `${id} was removed`, }))
    } catch(error) {
      yield put(JobActions.openErrorSnackbar(
        { message: `Failed to remove job '${id}'`, error, }))
    }
  }
}

export function* watchSetReadonly() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.SET_READONLY)
    const { id, } = payload

    try {
      validateId(id)
      yield call(API.setReadonly, id)
      yield put(JobApiActions.setReadonlySucceeded({ id, }))
    } catch (error) {
      yield put(JobActions.openErrorSnackbar(
        { message: `Failed to set readonly '${id}'`, error, }))
    }
   }
}

export function* watchUnsetReadonly() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.UNSET_READONLY)
    const { id, } = payload

    try {
      validateId(id)
      yield call(API.unsetReadonly, id)
      yield put(JobApiActions.unsetReadonlySucceeded({ id, }))
    } catch (error) {
      yield put(JobActions.openErrorSnackbar(
        { message: `Failed to unset readonly '${id}'`, error, }))
    }
  }
}

export function* watchStartJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.START)
    const { id, } = payload

    yield put(JobActions.startSwitching({ id, }))

    try {
      validateId(id)
      yield call(API.startJob, id)
      yield call(API.delay, JOB_TRANSITION_DELAY)
      yield put(JobApiActions.startJobSucceeded({ id, }))
    } catch (error) {
      yield put(JobActions.openErrorSnackbar(
        { message: `Failed to start job '${id}'`, error, }))
    }

    yield put(JobActions.endSwitching({ id, }))
  }
}

export function* watchStopJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.STOP)
    const { id, } = payload

    yield put(JobActions.startSwitching({ id, }))

    try {
      validateId(id)
      yield call(API.stopJob, id)
      yield call(API.delay, JOB_TRANSITION_DELAY)
      yield put(JobApiActions.stopJobSucceeded({ id, }))
    } catch (error) {
      yield put(JobActions.openErrorSnackbar(
        { message: `Failed to stop job '${id}'`, error, }))
    }

    yield put(JobActions.endSwitching(payload))
  }
}

export default function* root() {
  yield [
    fork(callFetchJobs),
    fork(watchStartJob),
    fork(watchStopJob),
    fork(watchOpenEditorDialogToEdit),
    fork(watchUpdateJob),
    fork(watchRemoveJob),
    fork(watchCreateJob),
    fork(watchSetReadonly),
    fork(watchUnsetReadonly),
  ]
}
