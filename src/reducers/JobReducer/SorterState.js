import { createAction, handleActions, } from 'redux-actions'

export const RUNNING = 'Running'
export const STOPPED = 'Stopped'
export const WAITING = 'Waiting'

export const AVAILABLE_STRATEGIES = [
  RUNNING,
  WAITING,
  STOPPED,
]

export const ActionType = {
  SORT: 'JOB_SORT',
}

export const Action = {
  sortJob: createAction(ActionType.SORT),
}

const INITIAL_STATE = {
  selectedStrategy: RUNNING,
  availableStrategies: AVAILABLE_STRATEGIES,
}

export const handler = handleActions({
  [ActionType.SORT]: (state, { payload, }) => /** string is immutable */
    Object.assign({}, state, { selectedStrategy: payload.strategy, }),
}, INITIAL_STATE)
