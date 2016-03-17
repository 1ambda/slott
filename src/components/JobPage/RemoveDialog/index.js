import React, { PropTypes, } from 'react'

import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'

import { JOB_PROPERTY, } from '../../../reducers/JobReducer/job'
import * as removeDialogStyle from './style'

export default class RemoveDialog extends React.Component {
  static propTypes = {
    job: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
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
    actions.closeRemoveDialog()
  }

  handleRemove() {
    const { actions, job, } = this.props
    actions.removeJob(job)
    actions.closeRemoveDialog()
  }

  render() {
    const { job, } = this.props

    const buttons = [
      <FlatButton
        style={removeDialogStyle.button}
        key="cancel" label="Cancel"
        secondary onTouchTap={this.handleClose.bind(this)} />,
      <FlatButton
        style={removeDialogStyle.button}
        key="remove" label="Remove"
        primary onTouchTap={this.handleRemove.bind(this)} />,
    ]

    const title = RemoveDialog.createTitle(job[JOB_PROPERTY.name])

    return (
      <Dialog
        title={title}
        actions={buttons}
        open modal={false}
        onRequestClose={this.handleClose.bind(this)} />
    )
  }
}
