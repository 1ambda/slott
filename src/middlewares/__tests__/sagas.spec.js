import { expect, } from 'chai'
import { fork, take, call, put, select, } from 'redux-saga/effects'
import { takeEvery, } from 'redux-saga'

import * as ClosableSnackBarState from '../../reducers/JobReducer/ClosableSnackbarState'
import * as SagaAction from '../SagaAction'

import * as Selector from '../../reducers/JobReducer/selector'

import * as API from '../api'
import * as Handler from '../handler'
import rootSaga, * as Sagas from '../sagas'

describe('sagas', () => {

  const takeEveryWatcherProps = [
    {
      actionType: SagaAction.ActionType.OPEN_EDITOR_DIALOG_TO_EDIT,
      watcher: Sagas.watchOpenEditorDialogToEdit,
      handler: Handler.handleOpenEditorDialogToEdit,
    },
    {
      actionType: SagaAction.ActionType.UPDATE,
      watcher: Sagas.watchUpdateJob,
      handler: Handler.handleUpdateJob,
    },
    {
      actionType: SagaAction.ActionType.CREATE,
      watcher: Sagas.watchCreateJob,
      handler: Handler.handleCreateJob,
    },
    {
      actionType: SagaAction.ActionType.REMOVE,
      watcher: Sagas.watchRemoveJob,
      handler: Handler.handleRemoveJob,
    },
    {
      actionType: SagaAction.ActionType.SET_READONLY,
      watcher: Sagas.watchSetReadonly,
      handler: Handler.handleSetReadonly,
    },
    {
      actionType: SagaAction.ActionType.UNSET_READONLY,
      watcher: Sagas.watchUnsetReadonly,
      handler: Handler.handleUnsetReadonly,
    },
    {
      actionType: SagaAction.ActionType.START,
      watcher: Sagas.watchStartJob,
      handler: Handler.handleStartJob,
    },
    {
      actionType: SagaAction.ActionType.STOP,
      watcher: Sagas.watchStopJob,
      handler: Handler.handleStopJob,
    },
  ]

  takeEveryWatcherProps.map(watcherProp => {
    describe('watchOpenEditorDialogToEdit', () => {
      const actionType = watcherProp.actionType
      const watcher = watcherProp.watcher
      const handler = watcherProp.handler
      it(`should
        - take (${actionType}
        - call ${handler.name})`, () => {

        const gen = watcher()
        const action = { payload: {}, }

        expect(gen.next().value).to.deep.equal(
          take(actionType)
        )

        expect(gen.next(action).value).to.deep.equal(
          fork(handler, action)
        )
      })
    })
  })

  describe('initialize', () => {
    it(`should callFetchContainerJobs`, () => {
      const gen = Sagas.initialize()
      expect(gen.next().value).to.deep.equal(
        call(Handler.callFetchContainerJobs)
      )

      expect(gen.next().done).to.deep.equal(true)
    })

    it(`should callFetchJobs
        - if exception is occurred,
          put(openErrorSnackbar with { message, error }`, () => {
      const gen = Sagas.initialize()

      expect(gen.next().value).to.deep.equal(
        call(Handler.callFetchContainerJobs)
      )

      const error = new Error('error')
      expect(gen.throw(error).value).to.deep.equal(
        put(ClosableSnackBarState.Action.openErrorSnackbar({ message: 'Failed to fetch jobs', error, }))
      )
    })
  })

  describe('RootSaga', () => {
    it(`should
        - fork callFetchJobs to initialize
        - fork other watchers
        `, () => {

      const gen = rootSaga()

      /** initialize */
      expect(gen.next().value).to.deep.equal( [
          fork(Sagas.initialize),
          fork(Sagas.watchOpenEditorDialogToEdit),
          fork(Sagas.watchUpdateJob),
          fork(Sagas.watchRemoveJob),
          fork(Sagas.watchCreateJob),
          fork(Sagas.watchSetReadonly),
          fork(Sagas.watchUnsetReadonly),
          fork(Sagas.watchStartJob),
          fork(Sagas.watchStopJob),
          fork(Sagas.watchChangeContainer),
        ]
      )
    })
  })

})
