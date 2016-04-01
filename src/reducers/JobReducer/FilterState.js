import { createAction, handleActions, } from 'redux-actions'

const INITIAL_STATE = '' /** initial state of filterKeyworld */

export const ActionType = {
  FILTER: 'JOB_FILTER',
  INITIALIZE_FILTER: 'JOB_INITIALIZE_FILTER',
}

export const Action = {
  filterJob: createAction(ActionType.FILTER),
  initializeFilter: createAction(ActionType.INITIALIZE_FILTER),
}

export const handler = handleActions({
  [ActionType.FILTER]: (state, { payload, }) =>
    payload.filterKeyword, /** string is immutable. we don't need to copy state */

  [ActionType.INITIALIZE_FILTER]: (state, { payload, }) =>
    INITIAL_STATE,
}, INITIAL_STATE)
