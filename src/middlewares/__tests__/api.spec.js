import { expect, } from 'chai'
import { fork, take, call, put, select, } from 'redux-saga/effects'

import * as API from '../api'
import * as Converter from '../converter'

describe('api', () => {
  // TODO, how to test `getContainerJobConfigUrl`?

  describe('High-level APIs', () => {

    describe(`${API.startJob.name}`, () => {
      it(`should call ${API.patchJobState.name} passing ${Converter.SERVER_JOB_PROPERTY.active} field only`, () => {
        const container = 'container01'
        const jobId = 'job01'
        const gen = API.startJob(container, jobId)
        expect(gen.next().value).to.deep.equal(
          call(API.patchJobState, container, jobId, Converter.createStateToStartJob())
        )
      })
    })

    describe(`${API.stopJob.name}`, () => {
      it(`should call ${API.patchJobState.name} passing ${Converter.SERVER_JOB_PROPERTY.active} field only`, () => {
        const container = 'container01'
        const jobId = 'job01'
        const gen = API.stopJob(container, jobId)
        expect(gen.next().value).to.deep.equal(
          call(API.patchJobState, container, jobId, Converter.createStateToStopJob())
        )
      })
    })

    describe(`${API.setReadonly.name}`, () => {
      it(`should call ${API.patchJobConfig.name} passing ${Converter.SERVER_JOB_PROPERTY.enabled} field only`, () => {
        const container = 'container01'
        const jobId = 'job01'
        const gen = API.setReadonly(container, jobId)
        expect(gen.next().value).to.deep.equal(
          call(API.patchJobConfig, container, jobId, Converter.createConfigToSetReadonly())
        )
      })
    })

    describe(`${API.unsetReadonly.name}`, () => {
      it(`should call ${API.patchJobConfig.name} passing ${Converter.SERVER_JOB_PROPERTY.enabled} field only`, () => {
        const container = 'container01'
        const jobId = 'job01'
        const gen = API.unsetReadonly(container, jobId)
        expect(gen.next().value).to.deep.equal(
          call(API.patchJobConfig, container, jobId, Converter.createConfigToUnsetReadonly())
        )
      })
    })

  })
})
