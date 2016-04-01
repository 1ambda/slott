import { createAction, } from 'redux-actions'

export const ActionType = {
  CREATE: 'JOB_API_CREATE',
  REMOVE: 'JOB_API_REMOVE',
  UPDATE: 'JOB_API_UPDATE',

  CHANGE_CONTAINER: 'JOB_API_CHANGE_CONTAINER',
  OPEN_EDITOR_DIALOG_TO_EDIT: 'JOB_API_OPEN_EDITOR_DIALOG_TO_EDIT',

  SET_READONLY: 'JOB_API_SET_READONLY',
  UNSET_READONLY: 'JOB_API_UNSET_READONLY',
  START: 'JOB_API_START',
  STOP: 'JOB_API_STOP',

  STOP_ALL: 'JOB_API_STOP_ALL',
  START_ALL: 'JOB_API_START_ALL',
}

export const Action = {
  createJob: createAction(ActionType.CREATE),
  removeJob: createAction(ActionType.REMOVE),
  updateJob: createAction(ActionType.UPDATE),

  changeContainer: createAction(ActionType.CHANGE_CONTAINER),
  openEditorDialogToEdit: createAction(ActionType.OPEN_EDITOR_DIALOG_TO_EDIT),

  unsetReadonly: createAction(ActionType.UNSET_READONLY),
  setReadonly: createAction(ActionType.SET_READONLY),
  startJob: createAction(ActionType.START),
  stopJob: createAction(ActionType.STOP),

  stopAllJobs: createAction(ActionType.STOP_ALL),
  startAllJobs: createAction(ActionType.START_ALL),
}

