import { fork, call, put, } from 'redux-saga/effects'
import { takeEvery, } from 'redux-saga'

import * as JobActions from '../actions/JobActions'
import * as JobActionTypes from '../constants/JobActionTypes'
import * as JobApiActionTypes from '../constants/JobApiActionTypes'
import * as Handler from './handler'

/**
 * watcher functions
 */

export function* initialize() {
  try {
    yield call(Handler.callFetchJobs)
  } catch (error) {
    yield put(JobActions.openErrorSnackbar({ message: 'Failed to fetch jobs', error, }))
  }
}

export function* watchOpenEditorDialogToEdit() {
  yield* takeEvery(
    JobActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT,
    Handler.handleOpenEditorDialogToEdit)
}

export function* watchUpdateJob() {
  yield* takeEvery(JobActionTypes.UPDATE, Handler.handleUpdateJob)
}

export function* watchCreateJob() {
  yield* takeEvery(JobActionTypes.CREATE, Handler.handleCreateJob)
}

export function* watchRemoveJob() {
  yield* takeEvery(JobActionTypes.REMOVE, Handler.handleRemoveJob)
}

export function* watchSetReadonly() {
  yield* takeEvery(JobActionTypes.SET_READONLY, Handler.handleSetReadonly)
}

export function* watchUnsetReadonly() {
  yield* takeEvery(JobActionTypes.UNSET_READONLY, Handler.handleUnsetReadonly)
}

export function* watchStartJob() {
  yield* takeEvery(JobActionTypes.START, Handler.handleStartJob)
}

export function* watchStopJob() {
  yield* takeEvery(JobActionTypes.STOP, Handler.handleStopJob)
}


export default function* root() {
  yield [
    fork(initialize),
    fork(watchOpenEditorDialogToEdit),
    fork(watchUpdateJob),
    fork(watchRemoveJob),
    fork(watchCreateJob),
    fork(watchSetReadonly),
    fork(watchUnsetReadonly),
    fork(watchStartJob),
    fork(watchStopJob),
  ]
}
