import { fork, call, put, } from 'redux-saga/effects'
import { takeEvery, } from 'redux-saga'

import * as SnackbarState from '../reducers/JobReducer/ClosableSnackbarState'
import * as SagaAction from './SagaAction'
import * as Handler from './handler'

/**
 * watcher functions
 */

export function* initialize() {
  try {
    yield call(Handler.callFetchContainerJobs)
  } catch (error) {
    yield put(
      SnackbarState.Action.openErrorSnackbar(
        { message: 'Failed to fetch jobs', error, }
      )
    )
  }
}

export function* watchOpenEditorDialogToEdit() {
  yield* takeEvery(
    SagaAction.ActionType.OPEN_EDITOR_DIALOG_TO_EDIT,
    Handler.handleOpenEditorDialogToEdit
  )
}

export function* watchUpdateJob() {
  yield* takeEvery(SagaAction.ActionType.UPDATE, Handler.handleUpdateJob)
}

export function* watchCreateJob() {
  yield* takeEvery(SagaAction.ActionType.CREATE, Handler.handleCreateJob)
}

export function* watchRemoveJob() {
  yield* takeEvery(SagaAction.ActionType.REMOVE, Handler.handleRemoveJob)
}

export function* watchSetReadonly() {
  yield* takeEvery(SagaAction.ActionType.SET_READONLY, Handler.handleSetReadonly)
}

export function* watchUnsetReadonly() {
  yield* takeEvery(SagaAction.ActionType.UNSET_READONLY, Handler.handleUnsetReadonly)
}

export function* watchStartJob() {
  yield* takeEvery(SagaAction.ActionType.START, Handler.handleStartJob)
}

export function* watchStopJob() {
  yield* takeEvery(SagaAction.ActionType.STOP, Handler.handleStopJob)
}

export function* watchChangeContainer() {
  yield* takeEvery(SagaAction.ActionType.CHANGE_CONTAINER, Handler.handleChangeContainerSelector)
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
