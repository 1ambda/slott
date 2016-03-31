import { handleActions, } from 'redux-actions'

import * as JobActionTypes from '../../constants/JobActionTypes'

export const handler = handleActions({
  [JobActionTypes.FILTER]: (state, { payload, }) =>
    payload.filterKeyword, /** string is immutable */
}, '' /** initial state of filterKeyworld */)
