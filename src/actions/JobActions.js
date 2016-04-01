import * as JobActionTypes from '../constants/JobActionTypes'
import { createAction, } from 'redux-actions'

/** job item */
export const startSwitching = createAction(JobActionTypes.START_SWITCHING)
export const endSwitching = createAction(JobActionTypes.END_SWITCHING)

/** sorter, containerSelector, filter, paginator */
export const sortJob = createAction(JobActionTypes.SORT)
export const filterJob = createAction(JobActionTypes.FILTER)
export const initializeFilter = createAction(JobActionTypes.INITIALIZE_FILTER)
export const changePageOffset = createAction(JobActionTypes.CHANGE_PAGE_OFFSET)

/** for dialogs, snackbar */
export const openEditorDialogToCreate= createAction(JobActionTypes.OPEN_EDITOR_DIALOG_TO_CREATE)
export const closeEditorDialog = createAction(JobActionTypes.CLOSE_EDITOR_DIALOG)
export const openConfirmDialogToRemove = createAction(JobActionTypes.OPEN_CONFIRM_DIALOG_TO_REMOVE)
export const closeConfirmDialog = createAction(JobActionTypes.CLOSE_CONFIRM_DIALOG)
export const openInfoSnackbar = createAction(JobActionTypes.OPEN_INFO_SNACKBAR)
export const openErrorSnackbar = createAction(JobActionTypes.OPEN_ERROR_SNACKBAR)
export const closeSnackbar = createAction(JobActionTypes.CLOSE_SNACKBAR)


