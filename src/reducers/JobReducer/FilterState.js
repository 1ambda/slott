import { handleActions, } from 'redux-actions'

import * as JobActionTypes from '../../constants/JobActionTypes'

const INITIAL_STATE = '' /** initial state of filterKeyworld */

export const handler = handleActions({
  [JobActionTypes.FILTER]: (state, { payload, }) =>
    payload.filterKeyword, /** string is immutable. we don't need to copy state */

  [JobActionTypes.INITIALIZE_FILTER]: (state, { payload, }) =>
    INITIAL_STATE,
}, INITIAL_STATE)
