import { expect, } from 'chai'
import { fork, take, call, put, select, } from 'redux-saga/effects'
import { takeEvery, } from 'redux-saga'

import * as ClosableSnackBarState from '../../reducers/JobReducer/ClosableSnackbarState'
import * as SagaAction from '../SagaAction'

import * as Handler from '../Handler'
import rootSaga, * as Saga from '../Saga'

describe('Saga', () => {

  const takeEveryWatcherProps = [
    {
      actionType: SagaAction.ActionType.OPEN_EDITOR_DIALOG_TO_EDIT,
      watcher: Saga.watchOpenEditorDialogToEdit,
      handler: Handler.handleOpenEditorDialogToEdit,
    },
    {
      actionType: SagaAction.ActionType.UPDATE,
      watcher: Saga.watchUpdateJob,
      handler: Handler.handleUpdateJob,
    },
    {
      actionType: SagaAction.ActionType.CREATE,
      watcher: Saga.watchCreateJob,
      handler: Handler.handleCreateJob,
    },
    {
      actionType: SagaAction.ActionType.REMOVE,
      watcher: Saga.watchRemoveJob,
      handler: Handler.handleRemoveJob,
    },
    {
      actionType: SagaAction.ActionType.SET_READONLY,
      watcher: Saga.watchSetReadonly,
      handler: Handler.handleSetReadonly,
    },
    {
      actionType: SagaAction.ActionType.UNSET_READONLY,
      watcher: Saga.watchUnsetReadonly,
      handler: Handler.handleUnsetReadonly,
    },
    {
      actionType: SagaAction.ActionType.START,
      watcher: Saga.watchStartJob,
      handler: Handler.handleStartJob,
    },
    {
      actionType: SagaAction.ActionType.STOP,
      watcher: Saga.watchStopJob,
      handler: Handler.handleStopJob,
    },
    {
      actionType: SagaAction.ActionType.START_ALL,
      watcher: Saga.watchStartAllJobs,
      handler: Handler.handleStartAllJobs,
    },
    {
      actionType: SagaAction.ActionType.STOP_ALL,
      watcher: Saga.watchStopAllJobs,
      handler: Handler.handleStopAllJobs,
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
    it('should callFetchContainerJobs', () => {
      const gen = Saga.initialize()
      expect(gen.next().value).to.deep.equal(
        call(Handler.callFetchContainerJobs)
      )

      expect(gen.next().done).to.deep.equal(true)
    })

    it(`should callFetchJobs
        - if exception is occurred,
          put(openErrorSnackbar with { message, error }`, () => {
      const gen = Saga.initialize()

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
      expect(gen.next().value).to.deep.equal([
          fork(Saga.initialize),
          fork(Saga.watchOpenEditorDialogToEdit),
          fork(Saga.watchUpdateJob),
          fork(Saga.watchRemoveJob),
          fork(Saga.watchCreateJob),
          fork(Saga.watchSetReadonly),
          fork(Saga.watchUnsetReadonly),
          fork(Saga.watchStartJob),
          fork(Saga.watchStopJob),
          fork(Saga.watchChangeContainer),
          fork(Saga.watchStartAllJobs),
          fork(Saga.watchStopAllJobs),
        ]
      )
    })
  })

})
