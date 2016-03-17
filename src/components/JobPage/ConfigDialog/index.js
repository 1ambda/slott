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

export function isConfigChanged(initial, updated) {
  return !(JSON.stringify(initial) === JSON.stringify(updated))
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
     * to avoid re-drawing the whole page whenever `config` is updated,
     * ConfigDialog manages editor as it's state
     */
    this.state = { editor: null, configChanged: false, }
  }

  /** component life-cycle */
  componentDidMount() {
    const { readonly, job, } = this.props
    const initialConfig = job[JOB_PROPERTY.config]

    const defaultMode = getDefaultEditorMode(readonly)
    const availableModes = getAvailableEditorModes(readonly)

    const options = {
      search: false, // TODO: fix search width
      mode: defaultMode,
      modes: availableModes,
      onError: this.handleEditorError.bind(this),
      onChange: this.handleConfigChanged.bind(this),
    }

    /** external library which does not be managed by React */
    const editor = new JSONEditor(document.getElementById(ELEM_ID_CONFIG_EDITOR), options, initialConfig)
    editor.expandAll()
    this.setState({ editor, })
  }

  /** component life-cycle */
  componentWillReceiveProps(nextProps) {
    const { job: nextJob, } = nextProps
    const { job: currentJob, } = this.props

    const { config: currentConfig, } = currentJob
    const { config: nextConfig, } = nextJob

    /** if config is updated, then disable `UPDATE` button */
    this.setState({ configChanged: isConfigChanged(currentConfig, nextConfig), })
  }

  getConfigFromEditor() {
    const { editor, } = this.state
    return editor.get()
  }

  handleConfigChanged() {
    const { job, } = this.props
    const { [JOB_PROPERTY.config]: initialConfig, } = job

    const updatedConfig = this.getConfigFromEditor()

    this.setState({ configChanged: isConfigChanged(initialConfig, updatedConfig), })
  }

  handleEditorError(err) {
    console.error(`JSONEditor: ${err}`) /** TODO 500 page */
  }

  handleClose() {
    const { actions, } = this.props
    actions.closeConfigDialog()
  }

  handleUpdate() {
    const { actions, job, } = this.props
    const { configChanged, } = this.state

    if (configChanged) {
      const updatedJob = modifyJob(job, JOB_PROPERTY.config, this.getConfigFromEditor())
      actions.updateConfig(updatedJob)
    }
  }

  render() {
    const { readonly, job, } = this.props
    const { name: title, } = job

    const { configChanged, } = this.state

    const buttons = [
      <FlatButton
        style={configDialogStyle.button} secondary
        key="cancel" label="Cancel"
        onTouchTap={this.handleClose.bind(this)} />,
      <FlatButton
        style={configDialogStyle.button} primary disabled={readonly || !configChanged}
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
