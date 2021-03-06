import React, { PropTypes, } from 'react'

import FlatButton from 'material-ui/FlatButton'
import Dialog from 'material-ui/Dialog'

import { JOB_PROPERTY, } from '../../../reducers/JobReducer/JobItemState'
import * as dialogStyle from './style'

export const CONFIRM_DIALOG_MODE = {
  ACTION_ALL: 'ACTION_ALL',
  REMOVE: 'REMOVE',
  CLOSE: 'CLOSE',
}

export default class ConfirmDialog extends React.Component {
  static propTypes = {
    job: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    dialogMode: PropTypes.string.isRequired,
  }

  static createTitle(element) {
    return (
      <div className="center" style={dialogStyle.title}>
        <span>Remove</span>
        <span style={dialogStyle.jobName}> {element}</span>
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
    const { job, dialogMode, } = this.props

    const submitButton = (CONFIRM_DIALOG_MODE.REMOVE === dialogMode) ?
      (<FlatButton
          style={dialogStyle.button} labelStyle={dialogStyle.buttonLabel}
          key="remove" label="Remove"
          primary onTouchTap={this.handleRemove.bind(this)} />) : null


    const buttons = [
      <FlatButton
        style={dialogStyle.button} labelStyle={dialogStyle.buttonLabel}
        secondary key="cancel" label="Cancel"
        onTouchTap={this.handleClose.bind(this)} />,
      submitButton,
    ]

    const title = ConfirmDialog.createTitle(job[JOB_PROPERTY.id])

    return (
      <Dialog
        title={title}
        actions={buttons}
        open modal={false}
        onRequestClose={this.handleClose.bind(this)} />
    )
  }
}
