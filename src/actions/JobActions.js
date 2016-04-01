import { createAction, } from 'redux-actions'

import * as JobApiActionTypes from '../constants/JobApiActionTypes'

import * as FilterState from '../reducers/JobReducer/FilterState'
import * as SorterState from '../reducers/JobReducer/SorterState'
import * as PaginatorState from '../reducers/JobReducer/PaginatorState'
import * as JobItemState from '../reducers/JobReducer/JobItemState'
import * as EditorDialogState from '../reducers/JobReducer/EditorDialogState'
import * as ConfirmDialogState from '../reducers/JobReducer/ConfirmDialogState'
import * as ClosableSnackBarState from '../reducers/JobReducer/ClosableSnackbarState'

/** job item */
export const startSwitching = JobItemState.Action.startSwitching
export const endSwitching = JobItemState.Action.endSwitching

/** sorter, containerSelector, filter, paginator */
export const filterJob = FilterState.Action.filterJob
export const initializeFilter = FilterState.Action.initializeFilter
export const sortJob = SorterState.Action.sortJob
export const changePageOffset = PaginatorState.Action.changePageOffset

/** for dialogs, snackbar */
export const openEditorDialogToCreate = EditorDialogState.Action.openEditorDialogToCreate
export const closeEditorDialog = EditorDialogState.Action.closeEditorDialog
export const openConfirmDialogToRemove = ConfirmDialogState.Action.openConfirmDialogToRemove
export const closeConfirmDialog = ConfirmDialogState.Action.closeConfirmDialog

export const openInfoSnackbar = ClosableSnackBarState.Action.openInfoSnackbar
export const openErrorSnackbar = ClosableSnackBarState.Action.openErrorSnackbar
export const closeSnackbar = ClosableSnackBarState.Action.closeSnackbar
