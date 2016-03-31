import { handleActions, } from 'redux-actions'

import * as JobActionTypes from '../../constants/JobActionTypes'

import { CLOSABLE_SNACKBAR_MODE, } from '../../components/Common/ClosableSnackbar'

const INITIAL_SNACKBAR_STATE = {
  snackbarMode: CLOSABLE_SNACKBAR_MODE.CLOSE,
  message: '',
}

export const handler = handleActions({
  /** snackbar related */
  [JobActionTypes.CLOSE_SNACKBAR]: (state) =>
    Object.assign({}, state, { snackbarMode: CLOSABLE_SNACKBAR_MODE.CLOSE, }),

  [JobActionTypes.OPEN_ERROR_SNACKBAR]: (state, { payload, }) =>
    Object.assign({}, state, {
      snackbarMode: CLOSABLE_SNACKBAR_MODE.OPEN,
      message: `[ERROR] ${payload.message} (${payload.error.message})`,
    }),

  [JobActionTypes.OPEN_INFO_SNACKBAR]: (state, { payload, }) =>
    Object.assign({}, state, {
      snackbarMode: CLOSABLE_SNACKBAR_MODE.OPEN,
      message: `[INFO] ${payload.message}`,
    }),

}, INITIAL_SNACKBAR_STATE)

