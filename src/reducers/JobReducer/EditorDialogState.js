import { createAction, handleActions, } from 'redux-actions'

import * as JobApiActionTypes from '../../constants/JobApiActionTypes'

import { EDITOR_DIALOG_MODE, } from '../../components/Common/EditorDialog'

export const ActionType = {
  OPEN_EDITOR_DIALOG_TO_CREATE: 'JOB_OPEN_EDITOR_DIALOG_TO_CREATE',
  CLOSE_EDITOR_DIALOG: 'JOB_CLOSE_EDITOR_DIALOG',
}

export const Action = {
  openEditorDialogToCreate: createAction(ActionType.OPEN_EDITOR_DIALOG_TO_CREATE),
  closeEditorDialog: createAction(ActionType.CLOSE_EDITOR_DIALOG),
}

const INITIAL_EDITOR_DIALOG_STATE = {
  id: '',
  job: {},
  dialogMode: EDITOR_DIALOG_MODE.CLOSE,
  readonly: true,
}

export const handler = handleActions({
  /** open editor dialog to edit */
  [JobApiActionTypes.FETCH_CONFIG.SUCCEEDED]: (state, { payload, }) =>
    Object.assign({}, INITIAL_EDITOR_DIALOG_STATE, {
      id: payload.id,
      readonly: payload.readonly,
      dialogMode: EDITOR_DIALOG_MODE.EDIT,
      job: payload.job,
    }),

  [ActionType.OPEN_EDITOR_DIALOG_TO_CREATE]: (state) =>
    Object.assign({}, INITIAL_EDITOR_DIALOG_STATE, {
      dialogMode: EDITOR_DIALOG_MODE.CREATE,
    }),

  [ActionType.CLOSE_EDITOR_DIALOG]: (state) =>
    Object.assign({}, INITIAL_EDITOR_DIALOG_STATE /** reset job */, {
      dialogMode: EDITOR_DIALOG_MODE.CLOSE,
      readonly: false,
    }),
}, INITIAL_EDITOR_DIALOG_STATE)
