import { combineReducers, } from 'redux'
import { handleActions, } from 'redux-actions'

import * as JobApiActionTypes from '../../constants/JobApiActionTypes'

import * as JobItemState from './JobItemState'
import * as PaginatorState from './PaginatorState'
import * as FilterState from './FilterState'
import * as SorterState from './SorterState'
import * as EditorDialogState from './EditorDialogState'
import * as ConfirmDialogState from './ConfirmDialogState'
import * as ClosableSnackbarState from './ClosableSnackbarState'
import * as JobContainerState from './JobContainerState'

export const JOB_STATE_PROPERTY = {
  JOB_ITEMS: 'items',
  PAGINATOR: 'paginator',
  FILTER: 'filterKeyword',
  EDITOR_DIALOG: 'editorDialog',
  CONFIRM_DIALOG: 'confirmDialog',
  SORTER: 'sortingStrategy',
  SNACKBAR: 'snackbar',
  CONTAINER_SELECTOR: 'containerSelector',
}

export default combineReducers({
  [JOB_STATE_PROPERTY.CONTAINER_SELECTOR]: JobContainerState.handler,
  [JOB_STATE_PROPERTY.JOB_ITEMS]: JobItemState.handler,
  [JOB_STATE_PROPERTY.PAGINATOR]: PaginatorState.handler,
  [JOB_STATE_PROPERTY.FILTER]: FilterState.handler,
  [JOB_STATE_PROPERTY.SORTER]: SorterState.handler,
  [JOB_STATE_PROPERTY.EDITOR_DIALOG]: EditorDialogState.handler,
  [JOB_STATE_PROPERTY.CONFIRM_DIALOG]: ConfirmDialogState.handler,
  [JOB_STATE_PROPERTY.SNACKBAR]: ClosableSnackbarState.handler,
})
