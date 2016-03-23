import { take, put, call, fork, select, } from 'redux-saga/effects'

import * as JobActions from '../actions/JobActions'
import * as JobActionTypes from '../constants/JobActionTypes'
import { sortJob, JOB_PROPERTY, } from '../reducers/JobReducer/job'
import * as JobSortStrategies from '../constants/JobSortStrategies'
import * as API from './api'
import * as Selectors from '../reducers/JobReducer/selector'
import * as Converter from './converter'

const JOB_TRANSITION_DELAY = 1000

const always = true /** takeEvery does'n work. (redux-saga 0.9.5) */

/** fetch all jobs, used to initialize  */
function* fetchJobs() {
  const { response, error, } = yield call(API.fetchJobs)

  if (error) yield put(JobActions.fetchJobsFailed({ error, }))
  else {
    const sortedJobs = sortJob(response, JobSortStrategies.INITIAL)
    yield put(JobActions.fetchJobsSucceeded({ jobs: sortedJobs, }))
  }
}

function* watchOpenEditorDialogToEdit() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT)
    const { id, readonly, } = payload
    const { response, error, } = yield call(API.fetchJob, id)

    if (error) yield put(JobActions.fetchJobFailed({ error, }))
    else {
      /** remove state, switching props */
      const filtered = Converter.refineClientPropsToRenderEditorDialog(response)
      yield put(JobActions.fetchJobSucceeded({ id, readonly, job: response, filteredJob: filtered, }))
    }
  }
}

function* watchUpdateJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.UPDATE)
    const { id, job, } = payload
    const { response: updatedJob, error, } = yield call(API.updateJob, id, job)

    if (error) yield put(JobActions.updateJobFailed({ id, error, }))
    else yield put(JobActions.updateJobSucceeded({ id, job: updatedJob, }))
  }
}

function* watchCreateJob() {
  while (always) {
    const { payload, } = yield take(JobActionTypes.CREATE)
    const { job, } = payload

    /** validate job */
    if (job === void 0 || Object.keys(job).length === 0) {
      /** if undefined or empty object */
      yield put(JobActions.createJobFailed({error: new Error('Empty job'),}))
      continue
    }

    const id = job[JOB_PROPERTY.id]
    /** id might be undefined */

    /** validate id */
    if (id === void 0 || '' === id) {
      yield put(JobActions.createJobFailed({error: new Error('Empty id'),}))
      continue
    }

    /** check already exists in client jobs */
    const jobItems = yield select(Selectors.getJobItems)
    const alreadyExistingId = jobItems.reduce((exist, job) => {
      return exist || id === job[JOB_PROPERTY.id]
    }, false)

    if (alreadyExistingId) {
      yield put(JobActions.createJobFailed({error: new Error(`Already exists: ${id}`),}))
      continue
    }

    /** create */
    const { error, } = yield call(API.createJob, job)

    if (error)
      yield put(JobActions.createJobFailed({ error, }))
    else {
      yield call(fetchJobs)
      /** fetch all job */
      yield put(JobActions.createJobSucceeded({ id, job, }))
    }
  }
}

function* watchRemoveJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.REMOVE)
    const { id, } = payload
    const { error, } = yield call(API.removeJob, id)

    if (error) yield put(JobActions.removeJobFailed({ id, error, }))
    else {
      yield call(fetchJobs) /** fetch all job */
      yield put(JobActions.removeJobSucceeded(payload))
    }
  }
}

function* watchSetReadonly() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.SET_READONLY)
    const { id, } = payload
    const { response: updatedJob, error, } = yield call(API.setReadonly, id)

    if (error) yield put(JobActions.setReadonlyFailed({ id, error, }))
    else {
      yield put(JobActions.setReadonlySucceeded({ id: updatedJob.id, }))
    }
   }
}

function* watchUnsetReadonly() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.UNSET_READONLY)
    const { id, } = payload
    const { response: updatedJob, error, } = yield call(API.unsetReadonly, id)

    if (error) yield put(JobActions.unsetReadonlyFailed({ id, error, }))
    else {
      yield put(JobActions.unsetReadonlySucceeded({ id: updatedJob.id, }))
    }
  }
}

function* watchStartJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.START)
    const { id, } = payload

    yield put(JobActions.startSwitching({ id, }))
    const { error, } = yield call(API.startJob, id)

    if (error) yield put(JobActions.startJobFailed({ id, error, }))
    else {
      yield call(API.delay, JOB_TRANSITION_DELAY)
      yield put(JobActions.startJobSucceeded({ id, }))
    }

    yield put(JobActions.endSwitching({ id, }))
  }
}

function* watchStopJob() {
  while(always) {
    const { payload, } = yield take(JobActionTypes.STOP)
    const { id, } = payload

    yield put(JobActions.startSwitching({ id, }))
    const { error, } = yield call(API.stopJob, id)

    if (error) yield put(JobActions.stopJobFailed({ id, error, }))
    else {
      yield call(API.delay, JOB_TRANSITION_DELAY)
      yield put(JobActions.stopJobSucceeded({ id, }))
    }

    yield put(JobActions.endSwitching(payload))
  }
}

export default function* root() {
  yield [
    fork(fetchJobs),
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
