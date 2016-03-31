import { expect, } from 'chai'
import { take, put, call, fork, select, } from 'redux-saga/effects'

import * as JobActions from '../../actions/JobActions'
import * as JobActionTypes from '../../constants/JobActionTypes'
import * as JobApiActions from '../../actions/JobApiActions'
import * as JobApiActionTypes from '../../constants/JobApiActionTypes'
import * as JobSortStrategies from '../../constants/JobSortStrategies'
import { JOB_PROPERTY, } from '../../reducers/JobReducer/JobItemState'
import { SERVER_JOB_PROPERTY, } from '../../middlewares/converter'
import * as Selector from '../../reducers/JobReducer/selector'

import * as API from '../api'
import * as Handler from '../handler'

describe('handler', () => {

  describe('utils', () => {

    describe('callFetchContainerJobs', () => {

      it(`should
          - select selected container
          - select sort starategy
          - call fetchContainerJobs with { container, }
          - put fetchContainerJobSucceeded with { container, jobs }
          - put sortJob { strategy, }
        `)

      const container = 'container01'
      const sortStrategy = 'strategy'
      const jobs = []

      const gen = Handler.callFetchContainerJobs()

      expect(gen.next().value).to.deep.equal(
        select(Selector.getSelectedContainer)
      )

      expect(gen.next(container).value).to.deep.equal(
        select(Selector.getCurrentSortStrategy)
      )

      expect(gen.next(sortStrategy).value).to.deep.equal(
        call(API.fetchContainerJobs, container)
      )

      expect(gen.next(jobs).value).to.deep.equal(
        put(JobApiActions.fetchContainerJobsSucceeded({ container, jobs }))
      )

      expect(gen.next().value).to.deep.equal(
        put(JobActions.sortJob({ strategy: sortStrategy, }))
      )

      expect(gen.next().done).to.equal(true)
    })

  })

  describe('handlers', () => {

    describe('handleOpenEditorDialogToEdit', () => {

      const handler = Handler.handleOpenEditorDialogToEdit

      it(`should
        - call fetchJobConfig with (id)
        - put fetchJobConfigSucceeded with { id, readonly, job: updatedJob }
        `, () => {

        const [id, readonly,] = ['job01', false]
        const payload = { [JOB_PROPERTY.id]: id, readonly, }
        const action = { payload, }
        const updatedJob = { [JOB_PROPERTY.id]: id, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          call(API.fetchJobConfig, id)
        )

        expect(gen.next(updatedJob).value).to.deep.equal(
          put(JobApiActions.fetchJobConfigSucceeded({ [JOB_PROPERTY.id]: id, readonly, job: updatedJob, }))
        )
      })

      it(`should
        - call fetchJobConfig with id
        - if exception is occurred,
          put openErrorSnackbar with { message, error, }
        `, () => {

        const [id, readonly,] = ['job01', false]
        const payload = { [JOB_PROPERTY.id]: id, readonly, }
        const action = { payload, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          call(API.fetchJobConfig, id)
        )

        const error = new Error('error01')
        expect(gen.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to fetch job '${id}`, error, }))
        )
      })
    })

    describe('handleUpdateJob', () => {

      const handler = Handler.handleUpdateJob

      it(`should
        - call updateJobConfig with (id, job)
        - put updatedJobSucceeded with { id, job: updatedJob }
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = {[JOB_PROPERTY.id]: id, job,}
        const action = { payload, }
        const updatedJob = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: ['tag01'],}

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          call(API.updateJobConfig, id, job) /** call api */
        )

        expect(gen.next(updatedJob).value).to.deep.equal(
          put(JobApiActions.updateJobSucceeded({[JOB_PROPERTY.id]: id, job: updatedJob,}))
        )

        expect(gen.next().value).to.deep.equal(
          put(JobActions.openInfoSnackbar({ message: `${id} was updated`, }))
        )
      })

      it(`should
        - call updateJobConfig with (id, job)
        - if exception is occurred,
          put openErrorSnackbar with { message, error, }
        `, () => {

        const id = 'job01'
        const job = { [JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [], }
        const payload = { [JOB_PROPERTY.id]: id, job, }
        const action = { payload, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          call(API.updateJobConfig, id, job) /** call api */
        )

        const error = new Error('error01')
        expect(gen.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to update job '${id}`, error, }))
        )
      })

    }) /** end describe watchUpdateJob */

    describe('handleCreateJob', () => {
      const handler = Handler.handleCreateJob

      it(`should
        - call createJob with (job)
        - call callFetchContainerJobs
        - put closeEditorDialog
        - put openInfoSnackbar
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = { job, }
        const action = { payload, }
        const existingJobs = []

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.getJobItems) /** select exisintg jobs */
        )

        expect(gen.next(existingJobs).value).to.deep.equal(
          call(API.createJob, job) /** call API */
        )

        expect(gen.next().value).to.deep.equal(
          call(Handler.callFetchContainerJobs) /** fetch all jobs */
        )

        expect(gen.next().value).to.deep.equal(
          put(JobActions.closeEditorDialog())
        )

        expect(gen.next().value).to.deep.equal(
          put(JobActions.openInfoSnackbar({ message: `${id} was created`, }))
        )
      })

      it(`should
        - call createJob with (job)
        - if exception is occurred while validating job,
          put openErrorSnackbar with { message, error, }
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = { job, }
        const action = { payload, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.getJobItems) /** select exisintg jobs */
        )

        const error = new Error('VALIDATION FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: 'Failed to create job' , error, }))
        )
      })

      it(`should
        - call createJob with (job)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = { job, }
        const action = { payload, }
        const existingJobs = []

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.getJobItems) /** select exisintg jobs */
        )

        const error = new Error('VALIDATION FAILED')

        expect(gen.next(existingJobs).value).to.deep.equal(
          call(API.createJob, job) /** call API */
        )

        expect(gen.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: 'Failed to create job' , error, }))
        )
      })

    }) /** end describe watchCreateJob */

    describe('handleRemoveJob', () => {
      const handler = Handler.handleRemoveJob

      it(`should
        - call removeJob with (id)
        - call callFetchContainerJobs
        - put openInfoSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          call(API.removeJob, id) /** call API */
        )

        expect(gen.next().value).to.deep.equal(
          call(Handler.callFetchContainerJobs) /** fetch all jobs */
        )

        expect(gen.next().value).to.deep.equal(
          put(JobActions.openInfoSnackbar({ message: `${id} was removed`, }))
        )
      })

      it(`should
        - call removeJob with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          call(API.removeJob, id) /** call API */
        )

        const error = new Error('REMOVE JOB FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to remove job '${id}'` , error, }))
        )
      })

    }) /** end describe watchRemoveJob */

    describe('handleSetReadonly', () => {
      const handler = Handler.handleSetReadonly

      it(`should
        - call setReadonly with (id)
        - put updatedJobSucceeded with { id, job }
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const updatedJob = { [JOB_PROPERTY.id]: id, [SERVER_JOB_PROPERTY.enabled]: false, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          call(API.setReadonly, id) /** call API */
        )

        expect(gen.next(updatedJob).value).to.deep.equal(
          put(JobApiActions.updateJobSucceeded({ [JOB_PROPERTY.id]: id, job: updatedJob, }))
        )
      })

      it(`should
        - call setReadonly with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          call(API.setReadonly, id) /** call API */
        )

        const error = new Error('SET READONLY FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to set readonly '${id}'` , error, }))
        )
      })

    }) /** end describe watchSetReadonly */

    describe('handleUnsetReadonly', () => {
      const handler = Handler.handleUnsetReadonly

      it(`should
        - call unsetReadonly with (id)
        - put updateJobSucceeded with { id, job }
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const updatedJob = { [JOB_PROPERTY.id]: id, [SERVER_JOB_PROPERTY.enabled]: true, }

        const saga = handler(action)

        expect(saga.next({ payload, }).value).to.deep.equal(
          call(API.unsetReadonly, id) /** call API */
        )

        expect(saga.next(updatedJob).value).to.deep.equal(
          put(JobApiActions.updateJobSucceeded({ [JOB_PROPERTY.id]: id, job: updatedJob, }))
        )
      })

      it(`should
        - call API.unsetReadonly with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          call(API.unsetReadonly, id) /** call API */
        )

        const error = new Error('UNSET READONLY FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to unset readonly '${id}'` , error, }))
        )
      })

    }) /** end describe watchSetReadonly */

    describe('handleStartJob', () => {
      const handler = Handler.handleStartJob

      it(`should
        - call startJob with (id)
        - put updateJobSucceeded with { id, job }
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const updatedJob = { [JOB_PROPERTY.id]: id, [SERVER_JOB_PROPERTY.active]: true, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          put(JobActions.startSwitching({ id, }))
        )

        expect(gen.next().value).to.deep.equal(
          call(API.startJob, id) /** call API */
        )

        expect(gen.next(updatedJob).value).to.deep.equal(
          call(API.delay, Handler.JOB_TRANSITION_DELAY) /** wait */
        )

        expect(gen.next().value).to.deep.equal(
          put(JobApiActions.updateJobSucceeded({ [JOB_PROPERTY.id]: id, job: updatedJob, }))
        )

        expect(gen.next().value).to.deep.equal(
          put(JobActions.endSwitching({ id, }))
        )
      })

      it(`should
        - call startJob with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          put(JobActions.startSwitching({ id, }))
        )

        expect(gen.next().value).to.deep.equal(
          call(API.startJob, id) /** call API */
        )

        const error = new Error('START FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to start job '${id}'` , error, }))
        )
      })

    }) /** end describe watchStartJob */

    describe('handleStopJob', () => {
      const handler = Handler.handleStopJob

      it(`should
        - call stopJob with (id)
        - put updateJobSucceeded with { id, job }
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const updatedJob = { [JOB_PROPERTY.id]: id, [SERVER_JOB_PROPERTY.active]: false, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          put(JobActions.startSwitching({ id, }))
        )

        expect(gen.next().value).to.deep.equal(
          call(API.stopJob, id) /** call API */
        )

        expect(gen.next(updatedJob).value).to.deep.equal(
          call(API.delay, Handler.JOB_TRANSITION_DELAY) /** wait */
        )

        expect(gen.next().value).to.deep.equal(
          put(JobApiActions.updateJobSucceeded({ [JOB_PROPERTY.id]: id, job: updatedJob, }))
        )

        expect(gen.next().value).to.deep.equal(
          put(JobActions.endSwitching({ id, }))
        )
      })

      it(`should
        - call stopJob with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          put(JobActions.startSwitching({ id, }))
        )

        expect(gen.next().value).to.deep.equal(
          call(API.stopJob, id) /** call API */
        )

        const error = new Error('STOP FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(JobActions.openErrorSnackbar({ message: `Failed to stop job '${id}'` , error, }))
        )
      })

    }) /** end describe watchStopJob */


  }) /** end describe watchers */
})
