import { expect, } from 'chai'

import * as JobItemState from '../JobItemState'

describe('JobActions', () => {
  const payload = 'payload'
  const PROP_NAME_TYPE = 'type'
  const PROP_NAME_PAYLOAD = 'payload'

  const EXPECTED_ACTIONS = [
    { name: 'startSwitching', type: JobItemState.ActionType.START_SWITCHING, },
    { name: 'endSwitching', type: JobItemState.ActionType.END_SWITCHING, },
  ]

  EXPECTED_ACTIONS.map(({ name, type, }) => {
    it(`should provide ${name} which return ${type} type`, () => {
      const result = JobItemState.Action[name](payload)
      expect(result[PROP_NAME_PAYLOAD]).to.equal(payload)
      expect(result[PROP_NAME_TYPE]).to.equal(type)
    })
  })
})
