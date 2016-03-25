import { expect, } from 'chai'
import { take, put, call, fork, select, } from 'redux-saga/effects'

import * as JobActions from '../../actions/JobActions'
import * as JobActionTypes from '../../constants/JobActionTypes'
import * as JobApiActions from '../../actions/JobApiActions'
import * as JobApiActionTypes from '../../constants/JobApiActionTypes'
import * as JobSortStrategies from '../../constants/JobSortStrategies'
import * as API from '../api'
import rootSaga, * as sagas from '../sagas'

describe('sagas', () => {
  describe('putOpenErrorSnackbarAction', () => {
    it(`should put ${JobActionTypes.OPEN_ERROR_SNACKBAR} with { message, error }`, () => {
      const [message, error] = ['error occurred', new Error('error01')]
      const saga = sagas.putOpenErrorSnackbarAction(message, error)

      expect(saga.next().value).to.deep.equal(
        put(JobActions.openErrorSnackbar({ message, error, }))
      )
    })
  })

  describe('putOpenInfoSnackbarAction', () => {
    it(`should put ${JobActionTypes.OPEN_INFO_SNACKBAR} with { message }`, () => {
      const [message, error] = ['error occurred', new Error('error01')]
      const saga = sagas.putOpenInfoSnackbarAction(message)

      expect(saga.next().value).to.deep.equal(
        put(JobActions.openInfoSnackbar({ message, }))
      )
    })
  })

  describe('callFetchJobs', () => {
    it(`should
        - get jobs from server
        - put ${JobApiActionTypes.FETCH_JOBS.SUCCEEDED} with { jobs }
        - put ${JobActionTypes.SORT} with { strategy: ${JobSortStrategies.INITIAL} }
        `, () => {
      const jobs = [ { id: 'job1', }, { id: 'job2', }]
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
    })
  })
})

describe('root saga', () => {
  it('should', () => {

  })
})
