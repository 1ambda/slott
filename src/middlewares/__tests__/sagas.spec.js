import { expect, } from 'chai'
import { take, put, call, fork, select, } from 'redux-saga/effects'

import * as JobActions from '../../actions/JobActions'
import * as JobActionTypes from '../../constants/JobActionTypes'
import * as JobApiActions from '../../actions/JobApiActions'
import * as JobApiActionTypes from '../../constants/JobApiActionTypes'
import * as JobSortStrategies from '../../constants/JobSortStrategies'
import { JOB_PROPERTY, } from '../../reducers/JobReducer/job'
import * as Selectors from '../../reducers/JobReducer/selector'

import * as API from '../api'
import rootSaga, * as sagas from '../sagas'

describe('sagas', () => {

  describe('utils', () => {

    describe('callFetchJobs', () => {
      it(`should
        - get jobs from server
        - put fetchJobsSucceeded with { jobs }
        - put sortJob with { strategy }
        `, () => {
        const jobs = [ { [JOB_PROPERTY.id]: 'job1', }, { [JOB_PROPERTY.id]: 'job2', }]
        const saga = sagas.callFetchJobs()

        expect(saga.next().value).to.deep.equal(
          call(API.fetchJobs)
        )

        expect(saga.next(jobs).value).to.deep.equal(
          put(JobApiActions.fetchJobsSucceeded({ jobs, }))
        )

        expect(saga.next().value).to.deep.equal(
          put(JobActions.sortJob({ strategy: JobSortStrategies.INITIAL, }))
        )

        expect(saga.next().done).to.equal(true)
      })
    })
  })

  describe('watchers', () => {

    describe('watchOpenEditorDialogToEdit', () => {

      const startingAction = JobActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT
      const watcher = sagas.watchOpenEditorDialogToEdit

      it(`should
        - take ${startingAction}
        - call fetchJobConfig with (id)
        - put fetchJobConfigSucceeded with { id, readonly, job: updatedJob }
        `, () => {

        const [id, readonly,] = ['job01', false]
        const payload = { [JOB_PROPERTY.id]: id, readonly, }
        const updatedJob = { [JOB_PROPERTY.id]: id, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction)
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          call(API.fetchJobConfig, id)
        )

        expect(saga.next(updatedJob).value).to.deep.equal(
          put(JobApiActions.fetchJobConfigSucceeded({ [JOB_PROPERTY.id]: id, readonly, job: updatedJob, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

      it(`should
        - take ${startingAction}
        - call fetchJobConfig with id
        - if exception is occurred,
          put openErrorSnackbar with { message, error, }
        `, () => {

        const [id, readonly,] = ['job01', false]
        const payload = { [JOB_PROPERTY.id]: id, readonly, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction)
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          call(API.fetchJobConfig, id)
        )

        const error = new Error('error01')
        expect(saga.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to fetch job '${id}`, error, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })
    })

    describe('watchUpdateJob', () => {
      const startingAction = JobActionTypes.UPDATE
      const watcher = sagas.watchUpdateJob

      it(`should
        - take ${startingAction}
        - call updateJob with (id, job)
        - put updatedJobSucceeded with { id, job: updatedJob }
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = {[JOB_PROPERTY.id]: id, job,}
        const updatedJob = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: ['tag01'],}

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({payload,}).value).to.deep.equal(
          call(API.updateJob, id, job) /** call api */
        )

        expect(saga.next(updatedJob).value).to.deep.equal(
          put(JobApiActions.updateJobSucceeded({[JOB_PROPERTY.id]: id, job: updatedJob,}))
        )

        expect(saga.next().value).to.deep.equal(
          put(JobActions.openInfoSnackbar({ message: `${id} was updated`, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

      it(`should
        - take ${startingAction}
        - call updateJob with (id, job)
        - if exception is occurred,
          put openErrorSnackbar with { message, error, }
        `, () => {

        const id = 'job01'
        const job = { [JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [], }
        const payload = { [JOB_PROPERTY.id]: id, job, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          call(API.updateJob, id, job) /** call api */
        )

        const error = new Error('error01')
        expect(saga.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to update job '${id}`, error, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

    }) /** end describe watchUpdateJob */

    describe('watchCreateJob', () => {
      const startingAction = JobActionTypes.CREATE
      const watcher = sagas.watchCreateJob

      it(`should
        - take ${startingAction}
        - call createJob with (job)
        - call callFetchJobs
        - put closeEditorDialog
        - put openInfoSnackbar
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = { job, }
        const existingJobs = []

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          select(Selectors.getJobItems) /** select exisintg jobs */
        )

        expect(saga.next(existingJobs).value).to.deep.equal(
          call(API.createJob, job) /** call API */
        )

        expect(saga.next().value).to.deep.equal(
          call(sagas.callFetchJobs) /** fetch all jobs */
        )

        expect(saga.next().value).to.deep.equal(
          put(JobActions.closeEditorDialog())
        )

        expect(saga.next().value).to.deep.equal(
          put(JobActions.openInfoSnackbar({ message: `${id} was created`, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

      it(`should
        - take ${startingAction}
        - call createJob with (job)
        - if exception is occurred while validating job,
          put openErrorSnackbar with { message, error, }
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = { job, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          select(Selectors.getJobItems) /** select exisintg jobs */
        )

        const error = new Error('VALIDATION FAILED')

        expect(saga.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: 'Failed to create job' , error, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

      it(`should
        - take ${startingAction}
        - call createJob with (job)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = { job, }
        const existingJobs = []

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          select(Selectors.getJobItems) /** select exisintg jobs */
        )

        const error = new Error('VALIDATION FAILED')

        expect(saga.next(existingJobs).value).to.deep.equal(
          call(API.createJob, job) /** call API */
        )

        expect(saga.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: 'Failed to create job' , error, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

    }) /** end describe watchCreateJob */

    describe('watchRemoveJob', () => {
      const startingAction = JobActionTypes.REMOVE
      const watcher = sagas.watchRemoveJob

      it(`should
        - take ${startingAction}
        - call removeJob with (id)
        - call callFetchJobs
        - put openInfoSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          call(API.removeJob, id) /** call API */
        )

        expect(saga.next().value).to.deep.equal(
          call(sagas.callFetchJobs) /** fetch all jobs */
        )

        expect(saga.next().value).to.deep.equal(
          put(JobActions.openInfoSnackbar({ message: `${id} was removed`, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

      it(`should
        - take ${startingAction}
        - call removeJob with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          call(API.removeJob, id) /** call API */
        )

        const error = new Error('REMOVE JOB FAILED')

        expect(saga.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to remove job '${id}'` , error, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

    }) /** end describe watchRemoveJob */

    describe('watchSetReadonly', () => {
      const startingAction = JobActionTypes.SET_READONLY
      const watcher = sagas.watchSetReadonly

      it(`should
        - take ${startingAction}
        - call API.setReadonly with (id)
        - put setReadonlySucceeded with { id }
        - put openInfoSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          call(API.setReadonly, id) /** call API */
        )

        expect(saga.next().value).to.deep.equal(
          put(JobApiActions.setReadonlySucceeded({ [JOB_PROPERTY.id]: id, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

      it(`should
        - take ${startingAction}
        - call setReadonly with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          call(API.setReadonly, id) /** call API */
        )

        const error = new Error('SET READONLY FAILED')

        expect(saga.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to set readonly '${id}'` , error, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

    }) /** end describe watchSetReadonly */

    describe('watchUnsetReadonly', () => {
      const startingAction = JobActionTypes.UNSET_READONLY
      const watcher = sagas.watchUnsetReadonly

      it(`should
        - take ${startingAction}
        - call API.unsetReadonly with (id)
        - put unsetReadonlySucceeded with { id }
        - put openInfoSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          call(API.unsetReadonly, id) /** call API */
        )

        expect(saga.next().value).to.deep.equal(
          put(JobApiActions.unsetReadonlySucceeded({ [JOB_PROPERTY.id]: id, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

      it(`should
        - take ${startingAction}
        - call unsetReadonly with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          call(API.unsetReadonly, id) /** call API */
        )

        const error = new Error('UNSET READONLY FAILED')

        expect(saga.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to unset readonly '${id}'` , error, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

    }) /** end describe watchSetReadonly */

    describe('watchStartJob', () => {
      const startingAction = JobActionTypes.START
      const watcher = sagas.watchStartJob

      it(`should
        - take ${startingAction}
        - call API.startJob with (id)
        - put startJobSucceeded with { id }
        - put openInfoSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          put(JobActions.startSwitching({ id, }))
        )

        expect(saga.next().value).to.deep.equal(
          call(API.startJob, id) /** call API */
        )

        expect(saga.next().value).to.deep.equal(
          call(API.delay, sagas.JOB_TRANSITION_DELAY) /** wait */
        )

        expect(saga.next().value).to.deep.equal(
          put(JobApiActions.startJobSucceeded({ [JOB_PROPERTY.id]: id, }))
        )

        expect(saga.next().value).to.deep.equal(
          put(JobActions.endSwitching({ id, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

      it(`should
        - take ${startingAction}
        - call startJob with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          put(JobActions.startSwitching({ id, }))
        )

        expect(saga.next().value).to.deep.equal(
          call(API.startJob, id) /** call API */
        )

        const error = new Error('START FAILED')

        expect(saga.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to start job '${id}'` , error, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

    }) /** end describe watchStartJob */

    describe('watchStopJob', () => {
      const startingAction = JobActionTypes.STOP
      const watcher = sagas.watchStopJob

      it(`should
        - take ${startingAction}
        - call API.stopJob with (id)
        - put stopJobSucceeded with { id }
        - put openInfoSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          put(JobActions.startSwitching({ id, }))
        )

        expect(saga.next().value).to.deep.equal(
          call(API.stopJob, id) /** call API */
        )

        expect(saga.next().value).to.deep.equal(
          call(API.delay, sagas.JOB_TRANSITION_DELAY) /** wait */
        )

        expect(saga.next().value).to.deep.equal(
          put(JobApiActions.stopJobSucceeded({ [JOB_PROPERTY.id]: id, }))
        )

        expect(saga.next().value).to.deep.equal(
          put(JobActions.endSwitching({ id, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

      it(`should
        - take ${startingAction}
        - call stopJob with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }

        const saga = watcher()

        expect(saga.next().value).to.deep.equal(
          take(startingAction) /** take */
        )

        expect(saga.next({ payload, }).value).to.deep.equal(
          put(JobActions.startSwitching({ id, }))
        )

        expect(saga.next().value).to.deep.equal(
          call(API.stopJob, id) /** call API */
        )

        const error = new Error('STOP FAILED')

        expect(saga.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to stop job '${id}'` , error, }))
        )

        expect(saga.next().done).to.deep.equal(false)
      })

    }) /** end describe watchStopJob */


  }) /** end describe watchers */
})
