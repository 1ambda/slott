import { take, put, call, fork, select, } from 'redux-saga/effects'

import * as JobActions from '../actions/JobActions'
import * as JobActionTypes from '../constants/JobActionTypes'
import { sortJob, JOB_PROPERTY, } from '../reducers/JobReducer/job'
import * as JobSortStrategies from '../constants/JobSortStrategies'
import * as API from './api'
import * as Selectors from '../reducers/JobReducer/selector'

const JOB_TRANSITION_DELAY = 1000

const always = true /** takeEvery does'n work. (redux-saga 0.9.5) */

/** fetch all jobs, used to initialize  */
function* callFetchJobs() {
  const jobs = yield call(API.fetchJobs)

  yield put(JobActions.fetchJobsSucceeded({ jobs, }))
  yield put(JobActions.sortJob({ strategy: JobSortStrategies.INITIAL, }))
}

function* putOpenErrorSnackbarAction(message, error) { yield put(JobActions.openErrorSnackbar({ message, error, })) }
function* putOpenInfoSnackbarAction(message) { yield put(JobActions.openInfoSnackbar({ message, })) }


/**
 * watcher functions
 *
 * every watcher should catch exceptions in while loop
 */
function* watchOpenEditorDialogToEdit() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT)
    const { id, readonly, } = payload

    try {
      const job = yield call(API.fetchJobConfig, id)
      yield put(JobActions.fetchJobConfigSucceeded({ id, readonly, job, }))
    } catch (error) {
      yield putOpenErrorSnackbarAction(`Failed to fetch job '${id}'`, error)
    }
  }
}

function* watchUpdateJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.UPDATE)
    const { id, job, } = payload

    try {
      const updatedJob = yield call(API.updateJob, id, job)
      yield putOpenInfoSnackbarAction(`${id} was updated`)
      yield put(JobActions.updateJobSucceeded({ id, job: updatedJob, }))
    } catch (error) {
      yield putOpenErrorSnackbarAction(`Failed to update job '${id}'`, error)
    }
  }
}

function* watchCreateJob() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.CREATE)
    const { job, } = payload

    /** validate job */
    if (job === void 0 || Object.keys(job).length === 0) { /** if undefined or empty object */
      yield putOpenErrorSnackbarAction(`Failed to create new job`, new Error('EMPTY JOB'))
      continue
    }

    const id = job[JOB_PROPERTY.id]
    /** id might be undefined */

    /** validate id */
    if (id === void 0 || '' === id) {
      yield putOpenErrorSnackbarAction(`Failed to create new job`, new Error('EMPTY ID'))
      continue
    }

    /** check already exists in client jobs */
    const jobItems = yield select(Selectors.getJobItems)
    const alreadyExistingId = jobItems.reduce((exist, job) => {
      return exist || id === job[JOB_PROPERTY.id]
    }, false)

    if (alreadyExistingId) {
      yield putOpenErrorSnackbarAction(`Duplicated id '${id}'`, new Error('DUPLICATED ID'))
      continue
    }

    try {
      yield call(API.createJob, job)
      yield call(callFetchJobs) /** fetch all job */
      yield put(JobActions.createJobSucceeded({ id, job, }))
      yield putOpenInfoSnackbarAction(`${id} was created`)
    } catch (error) {
      yield putOpenErrorSnackbarAction(`Failed to create new job '${id}'`, error)
    }
  }
}

function* watchRemoveJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.REMOVE)
    const { id, } = payload

    try {
      yield call(API.removeJob, id)
      yield call(callFetchJobs) /** fetch all job */
      yield put(JobActions.removeJobSucceeded(payload))
      yield putOpenInfoSnackbarAction(`${id} was removed`)
    } catch(error) {
      yield putOpenErrorSnackbarAction(`Failed to remove job '${id}'`, error)
    }
  }
}

function* watchSetReadonly() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.SET_READONLY)
    const { id, } = payload

    try {
      const updatedJob = yield call(API.setReadonly, id)
      yield put(JobActions.setReadonlySucceeded({ id: updatedJob.id, }))
    } catch (error) {
      yield putOpenErrorSnackbarAction(`Failed to set readonly '${id}'`, error)
    }
   }
}

function* watchUnsetReadonly() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.UNSET_READONLY)
    const { id, } = payload

    try {
      const updatedJob = yield call(API.unsetReadonly, id)
      yield put(JobActions.unsetReadonlySucceeded({ id: updatedJob.id, }))
    } catch (error) {
      yield putOpenErrorSnackbarAction(`Failed to unset readonly '${id}'`, error)
    }
  }
}

function* watchStartJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.START)
    const { id, } = payload

    yield put(JobActions.startSwitching({ id, }))

    try {
      yield call(API.startJob, id)
      yield call(API.delay, JOB_TRANSITION_DELAY)
      yield put(JobActions.startJobSucceeded({ id, }))
    } catch (error) {
      yield putOpenErrorSnackbarAction(`Failed to start job '${id}'`, error)
    }

    yield put(JobActions.endSwitching({ id, }))
  }
}

function* watchStopJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.STOP)
    const { id, } = payload

    yield put(JobActions.startSwitching({ id, }))

    try {
      yield call(API.stopJob, id)
      yield call(API.delay, JOB_TRANSITION_DELAY)
      yield put(JobActions.stopJobSucceeded({ id, }))
    } catch (error) {
      yield putOpenErrorSnackbarAction(`Failed to stop job '${id}'`, error)
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
