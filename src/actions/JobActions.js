import { createAction, } from 'redux-actions'

import * as EditorDialogState from '../reducers/JobReducer/EditorDialogState'
import * as FilterState from '../reducers/JobReducer/FilterState'
import * as SorterState from '../reducers/JobReducer/SorterState'
import * as PaginatorState from '../reducers/JobReducer/PaginatorState'
import * as JobItemState from '../reducers/JobReducer/JobItemState'
import * as ConfirmDialogState from '../reducers/JobReducer/ConfirmDialogState'
import * as ClosableSnackBarState from '../reducers/JobReducer/ClosableSnackbarState'

import * as SagaAction from '../middlewares/SagaAction'

/**
 * for documentation, enumerate all actions
 */
export default Object.assign({},
  { /** Component Actions */

    /** job items */
    startSwitching: JobItemState.Action.startSwitching,
    endSwitching: JobItemState.Action.endSwitching,

    /** sorter, containerSelector, filter, paginator */
    filterJob: FilterState.Action.filterJob,
    initializeFilter: FilterState.Action.initializeFilter,
    sortJob: SorterState.Action.sortJob,
    changePageOffset: PaginatorState.Action.changePageOffset,

    /** for dialogs, snackbar */
    openEditorDialogToCreate: EditorDialogState.Action.openEditorDialogToCreate,
    updateEditorDialogConfig: EditorDialogState.Action.updateEditorDialogConfig,
    closeEditorDialog: EditorDialogState.Action.closeEditorDialog,
    openConfirmDialogToRemove: ConfirmDialogState.Action.openConfirmDialogToRemove,
    closeConfirmDialog: ConfirmDialogState.Action.closeConfirmDialog,

    openInfoSnackbar: ClosableSnackBarState.Action.openInfoSnackbar,
    openErrorSnackbar: ClosableSnackBarState.Action.openErrorSnackbar,
    closeSnackbar: ClosableSnackBarState.Action.closeSnackbar,
  },

  { /** API Actions */
    unsetReadonly: SagaAction.Action.unsetReadonly,
    setReadonly: SagaAction.Action.setReadonly,
    startJob: SagaAction.Action.startJob,
    stopJob: SagaAction.Action.stopJob,

    createJob: SagaAction.Action.createJob,
    removeJob: SagaAction.Action.removeJob,
    updateJob: SagaAction.Action.updateJob,

    changeContainer: SagaAction.Action.changeContainer,
    openEditorDialogToEdit: SagaAction.Action.openEditorDialogToEdit,

    stopAllJobs: SagaAction.Action.stopAllJobs,
    startAllJobs: SagaAction.Action.startAllJobs,
  }
)
