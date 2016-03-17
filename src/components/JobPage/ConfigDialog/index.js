import React, { PropTypes, } from 'react'

import 'jsoneditor/dist/jsoneditor.min.css'
import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js'

import RaisedButton from 'material-ui/lib/raised-button'
import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'

import { JOB_PROPERTY, modifyJob, } from '../../../reducers/JobReducer/job'
import * as configDialogStyle from './style'

const ELEM_ID_CONFIG_EDITOR = 'config-editor'

export const EDITOR_MODES = {
  TREE: 'tree', VIEW: 'view', CODE: 'code',
}

export function getDefaultEditorMode (readonly) {
  if (readonly) return EDITOR_MODES.VIEW
  else return EDITOR_MODES.TREE
}

export function getAvailableEditorModes (readonly) {
  if (readonly) return [EDITOR_MODES.VIEW,]
  else return [EDITOR_MODES.TREE, EDITOR_MODES.CODE,]
}

export default class ConfigDialog extends React.Component {
  static propTypes = {
    job: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    readonly: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props)

    /**
     * since ConfigDialog is a standalone component,
     * it manages some internal state itself
     */
    this.state = { editor: null, }
  }

  componentDidMount() {
    const { readonly, job, } = this.props
    const config = job[JOB_PROPERTY.config]

    const defaultMode = getDefaultEditorMode(readonly)
    const availableModes = getAvailableEditorModes(readonly)

    const options = {
      search: false, // TODO: fix search width
      mode: defaultMode,
      modes: availableModes,
      onError: function (err) {
        console.error(`JSONEditor: ${err}`) // TODO: go to 500 page
      },
    }

    /** external library which does not be managed by React */
    const editor = new JSONEditor(document.getElementById(ELEM_ID_CONFIG_EDITOR), options, config)
    editor.expandAll()
    this.setState({ editor, })
  }

  handleClose() {
    const { actions, } = this.props
    actions.closeConfigDialog()
  }

  handleUpdate() {
    const { actions, job, } = this.props
    const { editor, } = this.state

    const updatedJob = modifyJob(job, JOB_PROPERTY.config, editor.get())

    actions.updateConfig(updatedJob)
  }

  render() {
    const { readonly, job, } = this.props
    const { name: title, } = job

    const buttons = [
      <FlatButton
        style={configDialogStyle.button} secondary
        key="cancel" label="Cancel"
        onTouchTap={this.handleClose.bind(this)} />,
      <FlatButton
        style={configDialogStyle.button} primary disabled={readonly}
        key="update" label="Update"
        onTouchTap={this.handleUpdate.bind(this)} />,
    ]

    return (
      <Dialog
        title={title} titleStyle={configDialogStyle.title}
        actions={buttons}
        open modal={false}
        onRequestClose={this.handleClose.bind(this)}>
        <div id={ELEM_ID_CONFIG_EDITOR} style={configDialogStyle.editor} />
      </Dialog>
    )
  }
}
