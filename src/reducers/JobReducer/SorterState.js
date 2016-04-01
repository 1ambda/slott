import { handleActions, } from 'redux-actions'

import * as JobActionTypes from '../../constants/JobActionTypes'

export const RUNNING = 'Running'
export const STOPPED = 'Stopped'
export const WAITING = 'Waiting'

export const AVAILABLE_STRATEGIES = [
  RUNNING,
  WAITING,
  STOPPED,
]

const INITIAL_STATE = {
  selectedStrategy: RUNNING,
  availableStrategies: AVAILABLE_STRATEGIES,
}

export const handler = handleActions({
  [JobActionTypes.SORT]: (state, { payload, }) => /** string is immutable */
    Object.assign({}, state, { selectedStrategy: payload.strategy, }),
}, INITIAL_STATE)
