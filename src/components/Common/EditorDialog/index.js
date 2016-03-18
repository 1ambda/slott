import React, { PropTypes, } from 'react'

import 'jsoneditor/dist/jsoneditor.min.css'
import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js'

import RaisedButton from 'material-ui/lib/raised-button'
import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'

import { JOB_PROPERTY, modifyJob, } from '../../../reducers/JobReducer/job'
import * as dialogStyle from './style'

const ELEM_ID_EDITOR_DIALOG = 'editor-dialog'

export const EDITOR_DIALOG_MODE = {
  EDIT: 'EDIT',
  CREATE: 'CREATE',
  CLOSE: 'CLOSE',
}

export const JSON_EDITOR_MODES = {
  TREE: 'tree', VIEW: 'view', CODE: 'code',
}

export function getDefaultEditorMode (readonly, dialogMode) {
  return (EDITOR_DIALOG_MODE.CREATE === dialogMode) ? JSON_EDITOR_MODES.CODE :
    (readonly) ? JSON_EDITOR_MODES.VIEW :
      JSON_EDITOR_MODES.TREE
}

export function getAvailableEditorModes (readonly, dialogMode) {
  return (EDITOR_DIALOG_MODE.CREATE === dialogMode) ? [JSON_EDITOR_MODES.CODE, JSON_EDITOR_MODES.TREE,] :
    (readonly) ? [JSON_EDITOR_MODES.VIEW,] :
      [JSON_EDITOR_MODES.TREE, JSON_EDITOR_MODES.CODE,]
}

export function isConfigChanged(initial, updated) {
  return !(JSON.stringify(initial) === JSON.stringify(updated))
}

export default class EditorDialog extends React.Component {
  static propTypes = {
    job: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
    readonly: PropTypes.bool.isRequired,
    dialogMode: PropTypes.string.isRequired, /** EDITOR_DIALOG_MODE */
  }

  constructor(props) {
    super(props)

    /**
     * to avoid re-drawing the whole page whenever `config` is updated,
     * EditorDialog manages editor as it's state
     */
    this.state = { editor: null, configChanged: false, }
  }

  /** component life-cycle */
  componentDidMount() {
    const { job, readonly, dialogMode, } = this.props
    const initialConfig = job[JOB_PROPERTY.config]

    const defaultMode = getDefaultEditorMode(readonly, dialogMode)
    const availableModes = getAvailableEditorModes(readonly, dialogMode)

    const onChangeHandler = (EDITOR_DIALOG_MODE.EDIT === dialogMode) ?
      this.handleConfigChanged.bind(this) : undefined
    const onErrorHandler = this.handleEditorError.bind(this)

    const options = {
      search: false, // TODO: fix search width
      mode: defaultMode,
      modes: availableModes,
      onChange: onChangeHandler,
      onError: onErrorHandler,
    }

    /** external library which does not be managed by React */
    const editor = new JSONEditor(document.getElementById(ELEM_ID_EDITOR_DIALOG), options, initialConfig)

    if (defaultMode !== JSON_EDITOR_MODES.CODE) editor.expandAll()

    this.setState({ editor, })
  }

  /** component life-cycle */
  componentWillReceiveProps(nextProps) {
    const { job: nextJob, } = nextProps
    const { job: currentJob, } = this.props

    const { config: currentConfig, } = currentJob
    const { config: nextConfig, } = nextJob

    /** if config is not changed, then disable `UPDATE` button */
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
    actions.closeEditorDialog()
  }

  handleUpdate() {
    const { actions, job, } = this.props
    const { configChanged, } = this.state

    if (configChanged) {
      const updatedJob = modifyJob(job, JOB_PROPERTY.config, this.getConfigFromEditor())
      actions.updateConfig(updatedJob)
    }
  }

  handleCreate() {
    const { actions, job, } = this.props

    const payload = { name: 'new job', config: this.getConfigFromEditor(), }

    actions.createJob(payload)
    actions.closeEditorDialog()
  }

  render() {
    const { readonly, job, dialogMode, } = this.props
    const { name: title, } = job

    const { configChanged, } = this.state

    const submitButton = (EDITOR_DIALOG_MODE.EDIT === dialogMode) ?
      (<FlatButton labelStyle={dialogStyle.buttonLabel}
                    style={dialogStyle.button}
                    primary disabled={readonly || !configChanged}
                    key="update" label="Update"
                    onTouchTap={this.handleUpdate.bind(this)} />) :
      (<FlatButton labelStyle={dialogStyle.buttonLabel}
                   style={dialogStyle.button}
                   primary
                   key="create" label="Create"
                   onTouchTap={this.handleCreate.bind(this)} /> )
    const buttons = [
      <FlatButton
        style={dialogStyle.button} labelStyle={dialogStyle.buttonLabel}
        secondary key="cancel" label="Cancel"
        onTouchTap={this.handleClose.bind(this)} />,
      submitButton,
    ]

    return (
      <Dialog
        title={title} titleStyle={dialogStyle.title}
        actions={buttons}
        open modal={false}
        onRequestClose={this.handleClose.bind(this)}>
        <div id={ELEM_ID_EDITOR_DIALOG} style={dialogStyle.editor} />
      </Dialog>
    )
  }
}
