import * as JobApiActions from '../JobApiActions'
import * as JobApiActionTypes from '../../constants/JobApiActionTypes'

describe('JobActions', () => {
  const payload = 'payload'
  const PROP_NAME_TYPE = 'type'
  const PROP_NAME_PAYLOAD = 'payload'

  const EXPECTED_ACTIONS = [
    { name: 'fetchJobsSucceeded', type: JobApiActionTypes.FETCH_JOBS.SUCCEEDED, },
    { name: 'removeJobSucceeded', type: JobApiActionTypes.REMOVE.SUCCEEDED, },
    { name: 'createJobSucceeded', type: JobApiActionTypes.CREATE.SUCCEEDED, },
    { name: 'fetchJobConfigSucceeded', type: JobApiActionTypes.FETCH_CONFIG.SUCCEEDED, },
    { name: 'updateJobSucceeded', type: JobApiActionTypes.UPDATE.SUCCEEDED, },
    { name: 'setReadonlySucceeded', type: JobApiActionTypes.SET_READONLY.SUCCEEDED, },
    { name: 'unsetReadonlySucceeded', type: JobApiActionTypes.UNSET_READONLY.SUCCEEDED, },
    { name: 'startJobSucceeded', type: JobApiActionTypes.START.SUCCEEDED, },
    { name: 'stopJobSucceeded', type: JobApiActionTypes.STOP.SUCCEEDED, },
  ]

  EXPECTED_ACTIONS.map(({ name, type, }) => {
    it(`should provide ${name} which return ${type} type`, () => {
      const result = JobApiActions[name](payload)
      expect(result).toEqual({
        [PROP_NAME_TYPE]: type,
        [PROP_NAME_PAYLOAD]: payload,
      })
    })
  })


})
