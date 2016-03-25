import { expect, } from 'chai'

import * as JobActions from '../JobActions'
import * as JobActionTypes from '../../constants/JobActionTypes'

describe('JobActions', () => {
  const payload = 'payload'
  const PROP_NAME_TYPE = 'type'
  const PROP_NAME_PAYLOAD = 'payload'

  const EXPECTED_ACTIONS = [
    /** job related */
    { name: 'unsetReadonly', type: JobActionTypes.UNSET_READONLY, },
    { name: 'setReadonly', type: JobActionTypes.SET_READONLY, },
    { name: 'startJob', type: JobActionTypes.START, },
    { name: 'stopJob', type: JobActionTypes.STOP, },
    { name: 'startSwitching', type: JobActionTypes.START_SWITCHING, },
    { name: 'endSwitching', type: JobActionTypes.END_SWITCHING, },
    { name: 'createJob', type: JobActionTypes.CREATE, },
    { name: 'removeJob', type: JobActionTypes.REMOVE, },
    { name: 'updateJob', type: JobActionTypes.UPDATE, },
    { name: 'startAllJobs', type: JobActionTypes.START_ALL, },
    { name: 'stopAllJobs', type: JobActionTypes.STOP_ALL, },

    /** sorter, filter, paginator */
    { name: 'sortJob', type: JobActionTypes.SORT, },
    { name: 'filterJob', type: JobActionTypes.FILTER, },
    { name: 'changePageOffset', type: JobActionTypes.CHANGE_PAGE_OFFSET, },

    /** dialog, snackbar */
    { name: 'openEditorDialogToEdit', type: JobActionTypes.OPEN_EDITOR_DIALOG_TO_EDIT, },
    { name: 'openEditorDialogToCreate', type: JobActionTypes.OPEN_EDITOR_DIALOG_TO_CREATE, },
    { name: 'closeEditorDialog', type: JobActionTypes.CLOSE_EDITOR_DIALOG, },

    { name: 'openConfirmDialogToRemove', type: JobActionTypes.OPEN_CONFIRM_DIALOG_TO_REMOVE, },
    { name: 'closeConfirmDialog', type: JobActionTypes.CLOSE_CONFIRM_DIALOG, },

    { name: 'openInfoSnackbar', type: JobActionTypes.OPEN_INFO_SNACKBAR, },
    { name: 'openErrorSnackbar', type: JobActionTypes.OPEN_ERROR_SNACKBAR, },
    { name: 'closeSnackbar', type: JobActionTypes.CLOSE_SNACKBAR, },
  ]

  EXPECTED_ACTIONS.map(({ name, type, }) => {
    it(`should provide ${name} which return ${type} type`, () => {
      const result = JobActions[name](payload)
      expect(result[PROP_NAME_PAYLOAD]).to.equal(payload)
      expect(result[PROP_NAME_TYPE]).to.equal(type)
    })
  })
})
