import { take, put, call, select, } from 'redux-saga/effects'

import * as FilterState from '../reducers/JobReducer/FilterState'
import * as SorterState from '../reducers/JobReducer/SorterState'
import * as PaginatorState from '../reducers/JobReducer/PaginatorState'
import * as JobItemState from '../reducers/JobReducer/JobItemState'
import * as ContainerSelectorState from '../reducers/JobReducer/ContainerSelectorState'
import * as EditorDialogState from '../reducers/JobReducer/EditorDialogState'
import * as ConfirmDialogState from '../reducers/JobReducer/ConfirmDialogState'
import * as SnackBarState from '../reducers/JobReducer/ClosableSnackbarState'

import * as SagaAction from '../middlewares/SagaAction'

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
  yield put(JobItemState.Action.updateAllJobs({ jobs, }))
  yield put(SorterState.Action.sortJob({ strategy: currentSortStrategy, }))
  yield put(ContainerSelectorState.Action.selectContainer({ container, }))
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
    yield put(EditorDialogState.Action.updateEditorDialogConfig({ id, readonly, job, }))
  } catch (error) {
    yield put(SnackBarState.Action.openErrorSnackbar(
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
    yield put(JobItemState.Action.updateJob({ id, job: updatedJob, }))
    yield put(
      SnackBarState.Action.openInfoSnackbar(
        { message: `${container}/${id} was updated`, }
      )
    )
  } catch (error) {
    yield put(
      SnackBarState.Action.openErrorSnackbar(
        { message: `Failed to update job '${container}/${id}`, error, }
      )
    )
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
    yield put(EditorDialogState.Action.closeEditorDialog())
    yield put(
      SnackBarState.Action.openInfoSnackbar(
        { message: `${container}/${id} was created`, }
      )
    )
  } catch (error) {
    yield put(
      SnackBarState.Action.openErrorSnackbar(
      { message: 'Failed to create job', error, }
      )
    )
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
    yield put(
      SnackBarState.Action.openInfoSnackbar(
        { message: `${container}/${id} was removed`, }
      )
    )
  } catch(error) {
    yield put(
      SnackBarState.Action.openErrorSnackbar(
      { message: `Failed to remove job '${container}/${id}'`, error, }
      )
    )
  }
}

export function* handleSetReadonly(action) {
  const { payload, } = action
  const { id, } = payload
  const container = yield select(Selector.selectedContainer)

  try {
    validateId(id)
    const updatedJob = yield call(API.setReadonly, container, id)
    yield put(JobItemState.Action.updateJob({ id, job: updatedJob, }))
  } catch (error) {
    yield put(
      SnackBarState.Action.openErrorSnackbar(
        { message: `Failed to set readonly '${container}/${id}'`, error, }
      )
    )
  }
}

export function* handleUnsetReadonly(action) {
  const { payload, } = action
  const { id, } = payload
  const container = yield select(Selector.selectedContainer)

  try {
    validateId(id)
    const updatedJob = yield call(API.unsetReadonly, container, id)
    yield put(JobItemState.Action.updateJob({ id, job: updatedJob, }))
  } catch (error) {
    yield put(
      SnackBarState.Action.openErrorSnackbar(
        { message: `Failed to unset readonly '${container}/${id}'`, error, }
      )
    )
  }
}

export function* handleStartJob(action) {
  const { payload, } = action
  const { id, } = payload
  const container = yield select(Selector.selectedContainer)

  yield put(JobItemState.Action.startSwitching({ id, }))

  try {
    validateId(id)
    const updatedJob = yield call(API.startJob, container, id)
    yield call(API.delay, JOB_TRANSITION_DELAY)
    yield put(JobItemState.Action.updateJob({ id, job: updatedJob, }))
  } catch (error) {
    yield put(
      SnackBarState.Action.openErrorSnackbar(
        { message: `Failed to start job '${container}/${id}'`, error, }
      )
    )
  }

  yield put(JobItemState.Action.endSwitching({ id, }))
}

export function* handleStopJob(action) {
  const { payload, } = action
  const { id, } = payload
  const container = yield select(Selector.selectedContainer)

  yield put(JobItemState.Action.startSwitching({ id, }))

  try {
    validateId(id)
    const updatedJob = yield call(API.stopJob, container, id)
    yield call(API.delay, JOB_TRANSITION_DELAY)
    yield put(JobItemState.Action.updateJob({ id, job: updatedJob, }))
  } catch (error) {
    yield put(
      SnackBarState.Action.openErrorSnackbar(
        { message: `Failed to stop job '${container}/${id}'`, error, }
      )
    )
  }

  yield put(JobItemState.Action.endSwitching(payload))
}

export function* handleChangeContainerSelector(action) {
  const { payload, } = action
  let container = null

  const currentSortStrategy = yield select(Selector.currentSortStrategy)

  try {
    container = payload.container /** payload might be undefined */

    const jobs = yield call(API.fetchJobs, container)
    yield put(JobItemState.Action.updateAllJobs({ jobs, }))
    yield put(SorterState.Action.sortJob({ strategy: currentSortStrategy, }))
    yield put(ContainerSelectorState.Action.selectContainer({ container, }))
  } catch (error) {
    yield put(
      SnackBarState.Action.openErrorSnackbar(
        { message: `Failed to fetch jobs from '${container}'`, error, }
      )
    )
  }
}


