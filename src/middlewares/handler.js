import { take, put, call, select, } from 'redux-saga/effects'

import * as JobActions from '../actions/JobActions'
import * as JobActionTypes from '../constants/JobActionTypes'
import * as JobApiActions from '../actions/JobApiActions'
import * as JobApiActionTypes from '../constants/JobApiActionTypes'

import {
  sortJob, JOB_PROPERTY, validateId, validateJobId, checkDuplicatedJob,
} from '../reducers/JobReducer/JobItemState'
import * as JobSortingStrategies from '../reducers/JobReducer/SorterState'
import * as API from './api'
import * as Selector from '../reducers/JobReducer/selector'

export const JOB_TRANSITION_DELAY = 1000

/** utils */

export function* callFetchContainerJobs() {
  const container = yield select(Selector.selectedContainer)
  const currentSortStrategy = yield select(Selector.currentSortStrategy)

  const jobs = yield call(API.fetchJobs, container)
  yield put(JobApiActions.fetchContainerJobsSucceeded({ container, jobs, }))
  yield put(JobActions.sortJob({ strategy: currentSortStrategy, }))
}

/**
 * handlers used in watcher functions
 *
 * every handler should catch exceptions
 */

export function* handleOpenEditorDialogToEdit(action) {
  const { payload, } = action
  const container = yield select(Selector.selectedContainer)
  const { id, readonly, } = payload

  try {
    const job = yield call(API.fetchJobConfig, container, id)
    yield put(JobApiActions.fetchJobConfigSucceeded({ id, readonly, job, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to fetch job '${container}/${id}`, error, })
    )
  }
}

export function* handleUpdateJob(action) {
  const { payload, } = action
  const { id, job, } = payload
  const container = yield select(Selector.selectedContainer)

  try {
    const updatedJob = yield call(API.updateJobConfig, container, id, job)
    yield put(JobApiActions.updateJobSucceeded({ id, job: updatedJob, }))
    yield put(JobActions.openInfoSnackbar({ message: `${container}/${id} was updated`, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar({ message: `Failed to update job '${container}/${id}`, error, }))
  }
}

export function* handleCreateJob(action) {
  const { payload, } = action
  const { job, } = payload
  const container = yield select(Selector.selectedContainer)

  try {
    /** validate */
    const id = validateJobId(job)
    const existingJobs = yield select(Selector.jobItems)
    checkDuplicatedJob(job, existingJobs)

    yield call(API.createJob, container, job) /** create job */
    yield call(callFetchContainerJobs)      /** fetch all jobs again */
    yield put(JobActions.closeEditorDialog())
    yield put(JobActions.openInfoSnackbar({ message: `${container}/${id} was created`, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: 'Failed to create job', error, }))
  }
}

export function* handleRemoveJob(action) {
  const { payload, } = action
  const { id, } = payload
  const container = yield select(Selector.selectedContainer)

  try {
    validateId(id)
    yield call(API.removeJob, container, id)
    yield call(callFetchContainerJobs) /** fetch all job again */
    yield put(JobActions.openInfoSnackbar({ message: `${container}/${id} was removed`, }))
  } catch(error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to remove job '${container}/${id}'`, error, }))
  }
}

export function* handleSetReadonly(action) {
  const { payload, } = action
  const { id, } = payload
  const container = yield select(Selector.selectedContainer)

  try {
    validateId(id)
    const updatedJob = yield call(API.setReadonly, container, id)
    yield put(JobApiActions.updateJobSucceeded({ id, job: updatedJob, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to set readonly '${container}/${id}'`, error, }))
  }
}

export function* handleUnsetReadonly(action) {
  const { payload, } = action
  const { id, } = payload
  const container = yield select(Selector.selectedContainer)

  try {
    validateId(id)
    const updatedJob = yield call(API.unsetReadonly, container, id)
    yield put(JobApiActions.updateJobSucceeded({ id, job: updatedJob, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to unset readonly '${container}/${id}'`, error, }))
  }
}

export function* handleStartJob(action) {
  const { payload, } = action
  const { id, } = payload
  const container = yield select(Selector.selectedContainer)

  yield put(JobActions.startSwitching({ id, }))

  try {
    validateId(id)
    const updatedJob = yield call(API.startJob, container, id)
    yield call(API.delay, JOB_TRANSITION_DELAY)
    yield put(JobApiActions.updateJobSucceeded({ id, job: updatedJob, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to start job '${container}/${id}'`, error, }))
  }

  yield put(JobActions.endSwitching({ id, }))
}

export function* handleStopJob(action) {
  const { payload, } = action
  const { id, } = payload
  const container = yield select(Selector.selectedContainer)

  yield put(JobActions.startSwitching({ id, }))

  try {
    validateId(id)
    const updatedJob = yield call(API.stopJob, container, id)
    yield call(API.delay, JOB_TRANSITION_DELAY)
    yield put(JobApiActions.updateJobSucceeded({ id, job: updatedJob, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to stop job '${container}/${id}'`, error, }))
  }

  yield put(JobActions.endSwitching(payload))
}

export function* handleChangeContainerSelector(action) {
  const { payload, } = action
  let container = null

  const currentSortStrategy = yield select(Selector.currentSortStrategy)

  try {
    container = payload.container /** payload might be undefined */

    const jobs = yield call(API.fetchJobs, container)
    yield put(JobApiActions.fetchContainerJobsSucceeded({ container, jobs, }))
    yield put(JobActions.sortJob({ strategy: currentSortStrategy, }))
  } catch (error) {
    yield put(JobActions.openErrorSnackbar(
      { message: `Failed to fetch jobs from '${container}'`, error, }))
  }
}


