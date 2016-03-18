import React, { PropTypes, } from 'react'

import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'

import { JOB_PROPERTY, } from '../../../reducers/JobReducer/job'
import * as removeDialogStyle from './style'

export const CONFIRM_DIALOG_MODE = {
  ACTION_ALL: 'ACTION_ALL',
  REMOVE: 'REMOVE',
}

export default class ConfirmDialog extends React.Component {
  static propTypes = {
    job: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    dialogMode: PropTypes.object.isRequired,
  }

  static createTitle(jobName) {
    return (
      <div className="center" style={removeDialogStyle.title}>
        <span>Remove</span>
        <span style={removeDialogStyle.jobName}> {jobName}</span>
      </div>
    )
  }

  handleClose() {
    const { actions, } = this.props
    actions.closeConfirmDialog()
  }

  handleRemove() {
    const { actions, job, } = this.props
    actions.removeJob(job)
    actions.closeConfirmDialog()
  }

  render() {
    const { job, } = this.props

    const buttons = [
      <FlatButton
        style={removeDialogStyle.button} labelStyle={removeDialogStyle.buttonLabel}
        secondary key="cancel" label="Cancel"
        onTouchTap={this.handleClose.bind(this)} />,
      <FlatButton
        style={removeDialogStyle.button} labelStyle={removeDialogStyle.buttonLabel}
        key="remove" label="Remove"
        primary onTouchTap={this.handleRemove.bind(this)} />,
    ]

    const title = ConfirmDialog.createTitle(job[JOB_PROPERTY.name])

    return (
      <Dialog
        title={title}
        actions={buttons}
        open modal={false}
        onRequestClose={this.handleClose.bind(this)} />
    )
  }
}
