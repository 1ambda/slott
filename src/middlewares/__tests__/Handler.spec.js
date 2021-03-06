import { expect, } from 'chai'
import { take, put, call, fork, select, } from 'redux-saga/effects'

import * as SorterState from '../../reducers/JobReducer/SorterState'
import * as JobItemState from '../../reducers/JobReducer/JobItemState'
import * as ContainerSelectorState from '../../reducers/JobReducer/ContainerSelectorState'
import * as EditorDialogState from '../../reducers/JobReducer/EditorDialogState'
import * as ClosableSnackBarState from '../../reducers/JobReducer/ClosableSnackbarState'

import { JOB_PROPERTY, } from '../../reducers/JobReducer/JobItemState'
import { SERVER_JOB_PROPERTY, } from '../../middlewares/Converter'
import * as Selector from '../../reducers/JobReducer/Selector'
import * as API from '../Api'
import * as Handler from '../Handler'

describe('handler', () => {

  describe('utils', () => {

    describe('callFetchContainerJobs', () => {

      it(`should
          - select Selector.getSelectedContainer
          - select Selector.getCurrentStarategy
          - call fetchContainerJobs with { container, }
          - put fetchContainerJobSucceeded with { jobs }
          - put sortJob { strategy, }
          - put selectContainer { container, }
        `)

      const container = 'container01'
      const sortStrategy = 'strategy'
      const jobs = []

      const gen = Handler.callFetchContainerJobs()

      expect(gen.next().value).to.deep.equal(
        select(Selector.selectedContainer)
      )

      expect(gen.next(container).value).to.deep.equal(
        select(Selector.currentSortStrategy)
      )

      expect(gen.next(sortStrategy).value).to.deep.equal(
        call(API.fetchJobs, container)
      )

      expect(gen.next(jobs).value).to.deep.equal(
        put(JobItemState.Action.updateAllJobs({ jobs, }))
      )

      expect(gen.next().value).to.deep.equal(
        put(SorterState.Action.sortJob({ strategy: sortStrategy, }))
      )

      expect(gen.next().value).to.deep.equal(
        put(ContainerSelectorState.Action.selectContainer({ container, }))
      )
    })

  })

  describe('handlers', () => {

    describe('handleOpenEditorDialogToEdit', () => {

      const handler = Handler.handleOpenEditorDialogToEdit

      it(`should
        - select Selector.getSelectedContainer
        - call fetchJobConfig with (container, id)
        - put fetchJobConfigSucceeded with { id, readonly, job: updatedJob }
        `, () => {

        const [id, readonly,] = [ 'job01', false, ]
        const payload = { [JOB_PROPERTY.id]: id, readonly, }
        const action = { payload, }
        const updatedJob = { [JOB_PROPERTY.id]: id, }
        const container = 'container'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          call(API.fetchJobConfig, container, id)
        )

        expect(gen.next(updatedJob).value).to.deep.equal(
          put(EditorDialogState.Action.updateEditorDialogConfig(
              { [JOB_PROPERTY.id]: id, readonly, job: updatedJob, }
            )
          )
        )
      })

      it(`should
        - select Selector.getSelectedContainer
        - call fetchJobConfig with (container, id)
        - if exception is occurred,
          put openErrorSnackbar with { message, error, }
        `, () => {

        const [id, readonly,] = [ 'job01', false, ]
        const payload = { [JOB_PROPERTY.id]: id, readonly, }
        const action = { payload, }
        const container = 'container'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          call(API.fetchJobConfig, container, id)
        )

        const error = new Error('error01')
        expect(gen.throw(error).value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openErrorSnackbar(
              { message: `Failed to fetch job '${container}/${id}`, error, })
          )
        )
      })
    })

    describe('handleUpdateJob', () => {

      const handler = Handler.handleUpdateJob

      it(`should
        - select Selector.getSelectedContainer
        - call updateJobConfig with (container, id, job)
        - put updatedJobSucceeded with { id, job: updatedJob }
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = {[JOB_PROPERTY.id]: id, job,}
        const action = { payload, }
        const updatedJob = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: ['tag01', ],}
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          call(API.updateJobConfig, container, id, job) /** call api */
        )

        expect(gen.next(updatedJob).value).to.deep.equal(
          put(JobItemState.Action.updateJob({[JOB_PROPERTY.id]: id, job: updatedJob,}))
        )

        expect(gen.next().value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openInfoSnackbar(
              { message: `${container}/${id} was updated`, }
            )
          )
        )
      })

      it(`should
        - select Selector.getSelectedContainer
        - call updateJobConfig with (container, id, job)
        - if exception is occurred,
          put openErrorSnackbar with { message, error, }
        `, () => {

        const id = 'job01'
        const job = { [JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [], }
        const payload = { [JOB_PROPERTY.id]: id, job, }
        const action = { payload, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          call(API.updateJobConfig, container, id, job) /** call api */
        )

        const error = new Error('error01')
        expect(gen.throw(error).value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openErrorSnackbar(
              { message: `Failed to update job '${container}/${id}`, error, }
            )
          )
        )
      })

    }) /** end describe watchUpdateJob */

    describe('handleCreateJob', () => {
      const handler = Handler.handleCreateJob

      it(`should
        - select Selector.getSelectedContainer
        - select Selector.getJobItems
        - call createJob with (container, job)
        - call callFetchContainerJobs
        - put closeEditorDialog
        - put openInfoSnackbar
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = { job, }
        const action = { payload, }
        const existingJobs = []
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          select(Selector.jobItems)
        )

        expect(gen.next(existingJobs).value).to.deep.equal(
          call(API.createJob, container, job) /** call API */
        )

        expect(gen.next().value).to.deep.equal(
          call(Handler.callFetchContainerJobs) /** fetch all jobs */
        )

        expect(gen.next().value).to.deep.equal(
          put(EditorDialogState.Action.closeEditorDialog())
        )

        expect(gen.next().value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openInfoSnackbar(
              { message: `${container}/${id} was created`, }
            )
          )
        )
      })

      it(`should
        - select Selector.getSelectedContainer
        - select Selector.getJobItems
        - if exception is occurred while validating job,
          put openErrorSnackbar with { message, error, }
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = { job, }
        const action = { payload, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          select(Selector.jobItems) /** select exisintg jobs */
        )

        const error = new Error('VALIDATION FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openErrorSnackbar(
              { message: 'Failed to create job' , error, }
            )
          )
        )
      })

      it(`should
        - select Selector.getSelectedContainer
        - select Selector.getJobItems
        - call createJob with (container, job)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const job = {[JOB_PROPERTY.id]: id, [JOB_PROPERTY.tags]: [],}
        const payload = { job, }
        const action = { payload, }
        const existingJobs = []
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          select(Selector.jobItems) /** select exisintg jobs */
        )

        const error = new Error('VALIDATION FAILED')

        expect(gen.next(existingJobs).value).to.deep.equal(
          call(API.createJob, container, job) /** call API */
        )

        expect(gen.throw(error).value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openErrorSnackbar(
              { message: 'Failed to create job' , error, }
            )
          )
        )
      })

    }) /** end describe watchCreateJob */

    describe('handleRemoveJob', () => {
      const handler = Handler.handleRemoveJob

      it(`should
        - select Selector.getSelectedContainer
        - call removeJob with (id)
        - call callFetchContainerJobs
        - put openInfoSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          call(API.removeJob, container, id) /** call API */
        )

        expect(gen.next().value).to.deep.equal(
          call(Handler.callFetchContainerJobs) /** fetch all jobs */
        )

        expect(gen.next().value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openInfoSnackbar(
              { message: `${container}/${id} was removed`, }
            )
          )
        )
      })

      it(`should
        - select Selector.getSelectedContainer
        - call removeJob with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          call(API.removeJob, container, id) /** call API */
        )

        const error = new Error('REMOVE JOB FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(ClosableSnackBarState.Action.openErrorSnackbar(
              { message: `Failed to remove job '${container}/${id}'` , error, }
            )
          )
        )
      })

    }) /** end describe watchRemoveJob */

    describe('handleSetReadonly', () => {
      const handler = Handler.handleSetReadonly

      it(`should
        - select Selector.getSelectedContainer
        - call setReadonly with (id)
        - put updatedJobSucceeded with { id, job }
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const updatedJob = { [JOB_PROPERTY.id]: id, [SERVER_JOB_PROPERTY.enabled]: false, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          call(API.setReadonly, container, id) /** call API */
        )

        expect(gen.next(updatedJob).value).to.deep.equal(
          put(JobItemState.Action.updateJob({ [JOB_PROPERTY.id]: id, job: updatedJob, }))
        )
      })

      it(`should
        - select Selector.getSelectedContainer
        - call setReadonly with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          call(API.setReadonly, container, id) /** call API */
        )

        const error = new Error('SET READONLY FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openErrorSnackbar(
              { message: `Failed to set readonly '${container}/${id}'` , error, }
            )
          )
        )
      })

    }) /** end describe watchSetReadonly */

    describe('handleUnsetReadonly', () => {
      const handler = Handler.handleUnsetReadonly

      it(`should
        - select Selector.getSelectedContainer
        - call unsetReadonly with (id)
        - put updateJobSucceeded with { id, job }
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const updatedJob = { [JOB_PROPERTY.id]: id, [SERVER_JOB_PROPERTY.enabled]: true, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          call(API.unsetReadonly, container, id) /** call API */
        )

        expect(gen.next(updatedJob).value).to.deep.equal(
          put(JobItemState.Action.updateJob({ [JOB_PROPERTY.id]: id, job: updatedJob, }))
        )
      })

      it(`should
        - select Selector.getSelectedContainer
        - call API.unsetReadonly with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          call(API.unsetReadonly, container, id) /** call API */
        )

        const error = new Error('UNSET READONLY FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openErrorSnackbar(
              { message: `Failed to unset readonly '${container}/${id}'` , error, }
            )
          )
        )
      })

    }) /** end describe watchSetReadonly */

    describe('handleStartJob', () => {
      const handler = Handler.handleStartJob

      it(`should
        - select Selector.getSelectedContainer
        - call startJob with (id)
        - put updateJobSucceeded with { id, job }
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const updatedJob = { [JOB_PROPERTY.id]: id, [SERVER_JOB_PROPERTY.active]: true, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          put(JobItemState.Action.startSwitching({ id, }))
        )

        expect(gen.next().value).to.deep.equal(
          call(API.startJob, container, id) /** call API */
        )

        expect(gen.next(updatedJob).value).to.deep.equal(
          call(API.delay, Handler.JOB_TRANSITION_DELAY) /** wait */
        )

        expect(gen.next().value).to.deep.equal(
          put(JobItemState.Action.updateJob({ [JOB_PROPERTY.id]: id, job: updatedJob, }))
        )

        expect(gen.next().value).to.deep.equal(
          put(JobItemState.Action.endSwitching({ id, }))
        )
      })

      it(`should
        - select Selector.getSelectedContainer
        - put startSwitching with { id, }
        - call startJob with { container, id }
        - if exception is occurred while calling api,
          put openErrorSnackbar
        - put endSwitching with { id }
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          put(JobItemState.Action.startSwitching({ id, }))
        )

        expect(gen.next().value).to.deep.equal(
          call(API.startJob, container, id) /** call API */
        )

        const error = new Error('START FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openErrorSnackbar(
              { message: `Failed to start job '${container}/${id}'` , error, }
            )
          )
        )

        expect(gen.next().value).to.deep.equal(
          put(JobItemState.Action.endSwitching({ id, }))
        )
      })

    }) /** end describe watchStartJob */

    describe('handleStopJob', () => {
      const handler = Handler.handleStopJob

      it(`should
        - select Selector.getSelectedContainer
        - put startSwitching with { id, }
        - call stopJob with (id)
        - put updateJobSucceeded with { id, job }
        - put endSwitching with { id, }
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const updatedJob = { [JOB_PROPERTY.id]: id, [SERVER_JOB_PROPERTY.active]: false, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          put(JobItemState.Action.startSwitching({ id, }))
        )

        expect(gen.next().value).to.deep.equal(
          call(API.stopJob, container, id) /** call API */
        )

        expect(gen.next(updatedJob).value).to.deep.equal(
          call(API.delay, Handler.JOB_TRANSITION_DELAY) /** wait */
        )

        expect(gen.next().value).to.deep.equal(
          put(JobItemState.Action.updateJob({ [JOB_PROPERTY.id]: id, job: updatedJob, }))
        )

        expect(gen.next().value).to.deep.equal(
          put(JobItemState.Action.endSwitching({ id, }))
        )
      })

      it(`should
        - select Selector.getSelectedContainer
        - put startSwitching with { id, }
        - call stopJob with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        - put endSwitching with { id, }
        `, () => {

        const id = 'job01'
        const payload = { [JOB_PROPERTY.id]: id, }
        const action = { payload, }
        const container = 'container01'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.selectedContainer)
        )

        expect(gen.next(container).value).to.deep.equal(
          put(JobItemState.Action.startSwitching({ id, }))
        )

        expect(gen.next().value).to.deep.equal(
          call(API.stopJob, container, id) /** call API */
        )

        const error = new Error('STOP FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openErrorSnackbar(
              { message: `Failed to stop job '${container}/${id}'` , error, }
            )
          )
        )

        expect(gen.next().value).to.deep.equal(
          put(JobItemState.Action.endSwitching({ id, }))
        )
      })

    }) /** end describe watchStopJob */


    describe('handleChangeContainerSelector', () => {
      const handler = Handler.handleChangeContainerSelector

      it(`should
        - select currentSortStrategy
        - call fetchJobs with (id)
        - put fetchJobsSucceeded with { job }
        - put sortJob with { strategy, }
        - put selectContainer with { container, }
        `, () => {

        const id = 'job01'
        const container = 'container01'
        const payload = { [JOB_PROPERTY.id]: id, container, }
        const action = { payload, }
        const jobs = []
        const strategy = 'strategy'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.currentSortStrategy)
        )

        expect(gen.next(strategy).value).to.deep.equal(
          call(API.fetchJobs, container) /** call API */
        )

        expect(gen.next(jobs).value).to.deep.equal(
          put(JobItemState.Action.updateAllJobs({ jobs, }))
        )

        expect(gen.next().value).to.deep.equal(
          put(SorterState.Action.sortJob({ strategy, }))
        )

        expect(gen.next().value).to.deep.equal(
          put(ContainerSelectorState.Action.selectContainer({ container, }))
        )
      })

      it(`should
        - select currentSortStrategy
        - call fetchJobs with (id)
        - if exception is occurred while calling api,
          put openErrorSnackbar
        `, () => {

        const id = 'job01'
        const container = 'container01'
        const payload = { [JOB_PROPERTY.id]: id, container, }
        const action = { payload, }
        const strategy = 'strategy'

        const gen = handler(action)

        expect(gen.next().value).to.deep.equal(
          select(Selector.currentSortStrategy)
        )

        expect(gen.next(strategy).value).to.deep.equal(
          call(API.fetchJobs, container) /** call API */
        )

        const error = new Error('FETCH JOBS FAILED')

        expect(gen.throw(error).value).to.deep.equal(
          put(
            ClosableSnackBarState.Action.openErrorSnackbar(
              { message: `Failed to fetch jobs from '${container}'`, error, }
            )
          )
        )
      })

    }) /** end describe watchStopJob */

  }) /** end describe watchers */
})
