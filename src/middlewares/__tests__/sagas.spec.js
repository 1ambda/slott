import { expect, } from 'chai'
import { fork, take, call, put, select, } from 'redux-saga/effects'
import { takeEvery, } from 'redux-saga'

import * as JobActions from '../../actions/JobActions'
import * as JobApiActions from '../../actions/JobApiActions'
import * as JobActionTypes from '../../constants/JobActionTypes'
import * as JobApiActionTypes from '../../constants/JobApiActionTypes'
import * as Selector from '../../reducers/JobReducer/selector'
import * as JobSortStrategies from '../../constants/JobSortStrategies'

import * as API from '../api'
import * as Handler from '../handler'
import rootSaga, * as Sagas from '../sagas'

describe('sagas', () => {

  const takeEveryWatcherProps = [
    {
      actionType: JobActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT,
      watcher: Sagas.watchOpenEditorDialogToEdit,
      handler: Handler.handleOpenEditorDialogToEdit,
    },
    {
      actionType: JobActionTypes.UPDATE,
      watcher: Sagas.watchUpdateJob,
      handler: Handler.handleUpdateJob,
    },
    {
      actionType: JobActionTypes.CREATE,
      watcher: Sagas.watchCreateJob,
      handler: Handler.handleCreateJob,
    },
    {
      actionType: JobActionTypes.REMOVE,
      watcher: Sagas.watchRemoveJob,
      handler: Handler.handleRemoveJob,
    },
    {
      actionType: JobActionTypes.SET_READONLY,
      watcher: Sagas.watchSetReadonly,
      handler: Handler.handleSetReadonly,
    },
    {
      actionType: JobActionTypes.UNSET_READONLY,
      watcher: Sagas.watchUnsetReadonly,
      handler: Handler.handleUnsetReadonly,
    },
    {
      actionType: JobActionTypes.START,
      watcher: Sagas.watchStartJob,
      handler: Handler.handleStartJob,
    },
    {
      actionType: JobActionTypes.STOP,
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
    it(`should callFetchJobs`, () => {
      const gen = Sagas.initialize()
      //const container = 'container01'
      //const jobs = []
      //
      //expect(gen.next().value).to.deep.equal(
      //  select(Selector.getSelectedContainer)
      //)
      //
      //
      //expect(gen.next(jobs).value).to.deep.equal(
      //  put(JobApiActions.fetchContainerJobsSucceeded({ container, jobs}))
      //)
      //
      //expect(gen.next(jobs).value).to.deep.equal(
      //  put(JobActions.sortJob({ strategy: JobSortStrategies.INITIAL, }))
      //)


      expect(gen.next().value).to.deep.equal(
        call(Handler.callFetchContainerJobs)
      )

      expect(gen.next().done).to.deep.equal(true)
    })

    it(`should callFetchJobs
        - if exception is occurred,
          put(JobActions.openErrorSnackbar with { message, error }`, () => {
      const gen = Sagas.initialize()

      expect(gen.next().value).to.deep.equal(
        call(Handler.callFetchContainerJobs)
      )

      const error = new Error('error')
      expect(gen.throw(error).value).to.deep.equal(
        put(JobActions.openErrorSnackbar({ message: 'Failed to fetch jobs', error, }))
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
