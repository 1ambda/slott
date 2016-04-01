import { createAction, handleActions, } from 'redux-actions'

import { CONFIRM_DIALOG_MODE, } from '../../components/Common/ConfirmDialog'

export const ActionType = {
  OPEN_CONFIRM_DIALOG_TO_REMOVE: 'JOB_OPEN_CONFIRM_DIALOG_TO_REMOVE',
  OPEN_CONFIRM_DIALOG_TO_ACTION_ALL: 'JOB_OPEN_CONFIRM_DIALOG_TO_ACTION_ALL',
  CLOSE_CONFIRM_DIALOG: 'JOB_CLOSE_CONFIRM_DIALOG',
}

export const Action = {
  openConfirmDialogToRemove: createAction(ActionType.OPEN_CONFIRM_DIALOG_TO_REMOVE),
  closeConfirmDialog: createAction(ActionType.CLOSE_CONFIRM_DIALOG),
}

const INITIAL_CONFIRM_DIALOG_STATE = {
  job: {},
  dialogMode: CONFIRM_DIALOG_MODE.CLOSE,
}

export const handler = handleActions({
  [ActionType.OPEN_CONFIRM_DIALOG_TO_ACTION_ALL]: (state, { payload, }) =>
    console.error('TODO: OPEN_CONFIRM_DIALOG_TO_ACTION_ALL in JobReducer'),

  [ActionType.OPEN_CONFIRM_DIALOG_TO_REMOVE]: (state, { payload, }) =>
    Object.assign({}, state, { job: payload, dialogMode: CONFIRM_DIALOG_MODE.REMOVE, }),

  [ActionType.CLOSE_CONFIRM_DIALOG]: (state, { payload, }) =>
    Object.assign({}, state, { dialogMode: CONFIRM_DIALOG_MODE.CLOSE, }),

}, INITIAL_CONFIRM_DIALOG_STATE)
