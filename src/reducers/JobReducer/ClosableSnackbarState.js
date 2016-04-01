import { createAction, handleActions, } from 'redux-actions'

import { CLOSABLE_SNACKBAR_MODE, } from '../../components/Common/ClosableSnackbar'


export const ActionType = {
  OPEN_ERROR_SNACKBAR: 'JOB_OPEN_ERROR_SNACKBAR',
  OPEN_INFO_SNACKBAR: 'JOB_OPEN_INFO_SNACKBAR',
  CLOSE_SNACKBAR: 'JOB_CLOSE_SNACKBAR',
}

export const Action = {
  openInfoSnackbar: createAction(ActionType.OPEN_INFO_SNACKBAR),
  openErrorSnackbar: createAction(ActionType.OPEN_ERROR_SNACKBAR),
  closeSnackbar: createAction(ActionType.CLOSE_SNACKBAR),
}

const INITIAL_SNACKBAR_STATE = {
  snackbarMode: CLOSABLE_SNACKBAR_MODE.CLOSE,
  message: '',
}

export const handler = handleActions({
  /** snackbar related */
  [ActionType.CLOSE_SNACKBAR]: (state) =>
    Object.assign({}, state, { snackbarMode: CLOSABLE_SNACKBAR_MODE.CLOSE, }),

  [ActionType.OPEN_ERROR_SNACKBAR]: (state, { payload, }) =>
    Object.assign({}, state, {
      snackbarMode: CLOSABLE_SNACKBAR_MODE.OPEN,
      message: `[ERROR] ${payload.message} (${payload.error.message})`,
    }),

  [ActionType.OPEN_INFO_SNACKBAR]: (state, { payload, }) =>
    Object.assign({}, state, {
      snackbarMode: CLOSABLE_SNACKBAR_MODE.OPEN,
      message: `[INFO] ${payload.message}`,
    }),

}, INITIAL_SNACKBAR_STATE)

