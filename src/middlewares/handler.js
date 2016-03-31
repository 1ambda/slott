import { take, put, call, select, } from 'redux-saga/effects'

import * as JobActions from '../actions/JobActions'
import * as JobActionTypes from '../constants/JobActionTypes'
import * as JobApiActions from '../actions/JobApiActions'
import * as JobApiActionTypes from '../constants/JobApiActionTypes'

import {
  sortJob, JOB_PROPERTY, validateId, validateJobId, checkDuplicatedJob,
} from '../reducers/JobReducer/JobItemState'
import * as JobSortStrategies from '../constants/JobSortStrategies'
import * as API from './api'
import * as Selectors from '../reducers/JobReducer/selector'

export const JOB_TRANSITION_DELAY = 1000

/** utils */

export function* callFetchContainerJobs() {
  const container = yield select(Selectors.getSelectedContainer)
  const currentSortStrategy = yield select(Selectors.getCurrentSortStrategy)

  const jobs = yield call(API.fetchContainerJobs, container)
  yield put(JobApiActions.fetchContainerJobsSucceeded({ container, jobs, }))
  yield put(JobActions.sortJob({ strategy: currentSortStrategy, })) // TODO select
}

/**
 * handlers used in watcher functions
 *
 * every handler should catch exceptions
 */

export function* handleOpenEditorDialogToEdit(action) {
  const { payload, } = action
  const { id, readonly, } = payload

  try {
    const job = yield call(API.fetchJobConfig, id)
    yield put(JobApiActions.fetchJobConfigSucceeded({ id, readonly, job, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar({ message: `Failed to fetch job '${id}`, error, }))
  }
}

export function* handleUpdateJob(action) {
  const { payload, } = action
  const { id, job, } = payload

  try {
    const updatedJob = yield call(API.updateJobConfig, id, job)
    yield put(JobApiActions.updateJobSucceeded({ id, job: updatedJob, }))
    yield put(JobActions.openInfoSnackbar({ message: `${id} was updated`, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar({ message: `Failed to update job '${id}`, error, }))
  }
}

export function* handleCreateJob(action) {
  const { payload, } = action
  const { job, } = payload

  try {
    /** validate */
    const id = validateJobId(job)
    const existingJobs = yield select(Selectors.getJobItems)
    checkDuplicatedJob(job, existingJobs)

    yield call(API.createJob, job) /** create job */
    yield call(callFetchContainerJobs)      /** fetch all jobs again */
    yield put(JobActions.closeEditorDialog())
    yield put(JobActions.openInfoSnackbar({ message: `${id} was created`, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: 'Failed to create job', error, }))
  }
}

export function* handleRemoveJob(action) {
  const { payload, } = action
  const { id, } = payload

  try {
    validateId(id)
    yield call(API.removeJob, id)
    yield call(callFetchContainerJobs) /** fetch all job again */
    yield put(JobActions.openInfoSnackbar({ message: `${id} was removed`, }))
  } catch(error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to remove job '${id}'`, error, }))
  }
}

export function* handleSetReadonly(action) {
  const { payload, } = action
  const { id, } = payload

  try {
    validateId(id)
    const updatedJob = yield call(API.setReadonly, id)
    yield put(JobApiActions.updateJobSucceeded({ id, job: updatedJob, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to set readonly '${id}'`, error, }))
  }
}

export function* handleUnsetReadonly(action) {
  const { payload, } = action
  const { id, } = payload

  try {
    validateId(id)
    const updatedJob = yield call(API.unsetReadonly, id)
    yield put(JobApiActions.updateJobSucceeded({ id, job: updatedJob, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to unset readonly '${id}'`, error, }))
  }
}

export function* handleStartJob(action) {
  const { payload, } = action
  const { id, } = payload

  yield put(JobActions.startSwitching({ id, }))

  try {
    validateId(id)
    const updatedJob = yield call(API.startJob, id)
    yield call(API.delay, JOB_TRANSITION_DELAY)
    yield put(JobApiActions.updateJobSucceeded({ id, job: updatedJob, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to start job '${id}'`, error, }))
  }

  yield put(JobActions.endSwitching({ id, }))
}

export function* handleStopJob(action) {
  const { payload, } = action
  const { id, } = payload

  yield put(JobActions.startSwitching({ id, }))

  try {
    validateId(id)
    const updatedJob = yield call(API.stopJob, id)
    yield call(API.delay, JOB_TRANSITION_DELAY)
    yield put(JobApiActions.updateJobSucceeded({ id, job: updatedJob, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to stop job '${id}'`, error, }))
  }

  yield put(JobActions.endSwitching(payload))
}

export function* handleChangeContainerSelector(action) {
  const { payload, } = action
  let container = null

  try {
    container = payload.container

    const jobs = yield call(API.fetchContainerJobs, container)
    yield put(JobApiActions.fetchContainerJobsSucceeded({ container, jobs, }))
    yield put(JobActions.sortJob({ strategy: JobSortStrategies.INITIAL, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to fetch job in container '${container}'`, error, }))
  }
}


