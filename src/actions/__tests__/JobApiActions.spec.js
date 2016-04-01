import { expect, } from 'chai'

import * as JobApiActionTypes from '../../constants/JobApiActionTypes'
import * as JobApiActions from '../JobApiActions'

describe('JobActions', () => {
  const payload = 'payload'
  const PROP_NAME_TYPE = 'type'
  const PROP_NAME_PAYLOAD = 'payload'

  const EXPECTED_ACTIONS = [

    /** job items */
    { name: 'unsetReadonly', type: JobApiActionTypes.UNSET_READONLY.REQUESTED, },
    { name: 'setReadonly', type: JobApiActionTypes.SET_READONLY.REQUESTED, },
    { name: 'startJob', type: JobApiActionTypes.START.REQUESTED, },
    { name: 'stopJob', type: JobApiActionTypes.STOP.REQUESTED, },
    { name: 'createJob', type: JobApiActionTypes.CREATE.REQUESTED, },
    { name: 'removeJob', type: JobApiActionTypes.REMOVE.REQUESTED, },
    { name: 'updateJob', type: JobApiActionTypes.UPDATE.REQUESTED, },
    { name: 'changeContainer', type: JobApiActionTypes.CHANGE_CONTAINER.REQUESTED, },

    { name: 'startAllJobs', type: JobApiActionTypes.START_ALL.REQUESTED, },
    { name: 'stopAllJobs', type: JobApiActionTypes.STOP_ALL.REQUESTED, },

    /** dialog */
    { name: 'openEditorDialogToEdit', type: JobApiActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT.REQUESTED, },

    /** succeeded */
    { name: 'fetchJobsSucceeded', type: JobApiActionTypes.FETCH_JOBS.SUCCEEDED, },
    { name: 'removeJobSucceeded', type: JobApiActionTypes.REMOVE.SUCCEEDED, },
    { name: 'createJobSucceeded', type: JobApiActionTypes.CREATE.SUCCEEDED, },
    { name: 'fetchJobConfigSucceeded', type: JobApiActionTypes.FETCH_CONFIG.SUCCEEDED, },
    { name: 'updateJobSucceeded', type: JobApiActionTypes.UPDATE.SUCCEEDED, },
  ]

  EXPECTED_ACTIONS.map(({ name, type, }) => {
    it(`should provide ${name} which return ${type} type`, () => {
      const result = JobApiActions[name](payload)
      expect(result[PROP_NAME_PAYLOAD]).to.equal(payload)
      expect(result[PROP_NAME_TYPE]).to.equal(type)
    })
  })
})
