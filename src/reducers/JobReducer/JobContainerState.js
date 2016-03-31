import { handleActions, } from 'redux-actions'

import * as JobApiActionTypes from '../../constants/JobApiActionTypes'
import * as URL from '../../constants/url'

export const SELECTOR_MODE = {
  ALL: 'ALL',
  EACH: 'EACH',
}

export const INITIAL_STATE = {
  selectMode: SELECTOR_MODE.EACH,
  selectedContainer: URL.INITIAL_CONTAINER_NAME,
  availableContainers: URL.CONTAINER_NAMES,
}

export const handler = handleActions({
  [JobApiActionTypes.FETCH_CONTAINER_JOBS.SUCCEEDED]: (state, { payload, }) => {
    const { container, } = payload
    return Object.assign({}, state, { selectedContainer: container, })
  },

}, INITIAL_STATE)
