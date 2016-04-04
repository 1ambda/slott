import { expect, } from 'chai'

import {
  ActionType, Action, JOB_STATE, JOB_PROPERTY, INITIAL_JOB_STATE,
  isRunning, isStopped, isWaiting,
} from '../JobItemState'
import * as SorterState from '../SorterState'

describe('JobItemState', () => {
  const payload = 'payload'
  const PROP_NAME_TYPE = 'type'
  const PROP_NAME_PAYLOAD = 'payload'

  const EXPECTED_ACTIONS = [
    { name: 'startSwitching', type: ActionType.START_SWITCHING, },
    { name: 'endSwitching', type: ActionType.END_SWITCHING, },
    { name: 'updateAllJobs', type: ActionType.UPDATE_ALL_JOBS, },
    { name: 'updateJob', type: ActionType.UPDATE_JOB, },
  ]

  EXPECTED_ACTIONS.map(({ name, type, }) => {
    it(`should provide ${name} which return ${type} type`, () => {
      const result = Action[name](payload)
      expect(result[PROP_NAME_PAYLOAD]).to.equal(payload)
      expect(result[PROP_NAME_TYPE]).to.equal(type)
    })
  })
})
