import { expect, } from 'chai'

import * as JobActions from '../JobActions'
import * as JobActionTypes from '../../constants/JobActionTypes'

describe('JobActions', () => {
  const payload = 'payload'
  const PROP_NAME_TYPE = 'type'
  const PROP_NAME_PAYLOAD = 'payload'

  const EXPECTED_ACTIONS = [
    /** job related */
    { name: 'startSwitching', type: JobActionTypes.START_SWITCHING, },
    { name: 'endSwitching', type: JobActionTypes.END_SWITCHING, },

    /** sorter, containerSelector, filter, paginator */
    { name: 'sortJob', type: JobActionTypes.SORT, },
    { name: 'filterJob', type: JobActionTypes.FILTER, },
    { name: 'changePageOffset', type: JobActionTypes.CHANGE_PAGE_OFFSET, },

    /** dialog, snackbar */
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
