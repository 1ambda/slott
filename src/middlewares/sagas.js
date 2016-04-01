import { fork, call, put, } from 'redux-saga/effects'
import { takeEvery, } from 'redux-saga'

import * as JobActions from '../actions/JobActions'
import * as JobApiActionTypes from '../constants/JobApiActionTypes'
import * as Handler from './handler'

/**
 * watcher functions
 */

export function* initialize() {
  try {
    yield call(Handler.callFetchContainerJobs)
  } catch (error) {
    yield put(JobActions.openErrorSnackbar({ message: 'Failed to fetch jobs', error, }))
  }
}

export function* watchOpenEditorDialogToEdit() {
  yield* takeEvery(
    JobApiActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT.REQUESTED,
    Handler.handleOpenEditorDialogToEdit)
}

export function* watchUpdateJob() {
  yield* takeEvery(JobApiActionTypes.UPDATE.REQUESTED, Handler.handleUpdateJob)
}

export function* watchCreateJob() {
  yield* takeEvery(JobApiActionTypes.CREATE.REQUESTED, Handler.handleCreateJob)
}

export function* watchRemoveJob() {
  yield* takeEvery(JobApiActionTypes.REMOVE.REQUESTED, Handler.handleRemoveJob)
}

export function* watchSetReadonly() {
  yield* takeEvery(JobApiActionTypes.SET_READONLY.REQUESTED, Handler.handleSetReadonly)
}

export function* watchUnsetReadonly() {
  yield* takeEvery(JobApiActionTypes.UNSET_READONLY.REQUESTED, Handler.handleUnsetReadonly)
}

export function* watchStartJob() {
  yield* takeEvery(JobApiActionTypes.START.REQUESTED, Handler.handleStartJob)
}

export function* watchStopJob() {
  yield* takeEvery(JobApiActionTypes.STOP.REQUESTED, Handler.handleStopJob)
}

export function* watchChangeContainer() {
  yield* takeEvery(JobApiActionTypes.CHANGE_CONTAINER.REQUESTED, Handler.handleChangeContainerSelector)
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
    fork(watchChangeContainer),
  ]
}
