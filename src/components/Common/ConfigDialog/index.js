import React, { PropTypes, } from 'react'
import ReactDOM from 'react-dom'

import 'jsoneditor/dist/jsoneditor.min.css'
import JSONEditor from 'jsoneditor/dist/jsoneditor.min.js'

import RaisedButton from 'material-ui/lib/raised-button'
import Dialog from 'material-ui/lib/dialog'

const ELEM_ID_CONFIG_EDITOR = 'config-editor'
import * as configDialogStyle from './style'

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
    title: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    readonly: PropTypes.bool.isRequired,
    updateHandler: PropTypes.func.isRequired,
    closeHandler: PropTypes.func.isRequired,
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
    const { readonly, config, } = this.props

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
    this.setState({ editor, })
  }

  handleClose() {
    const { closeHandler, } = this.props

    closeHandler()
  }

  handleUpdate() {
    const { updateHandler, } = this.props
    const { editor, } = this.state

    updateHandler(editor.get()) /** pass current config */
  }

  render() {
    const { title, readonly, } = this.props

    const actions = [
      <RaisedButton
        style={configDialogStyle.actionButton}
        key="cancel"
        label="Cancel"
        secondary
        onTouchTap={this.handleClose.bind(this)} />,
      <RaisedButton
        style={configDialogStyle.actionButton}
        key="update"
        label="Update"
        primary disabled={readonly}
        onTouchTap={this.handleUpdate.bind(this)} />,
    ]

    return (
      <Dialog
        title={title}
        actions={actions}
        open modal={false}
        onRequestClose={this.handleClose.bind(this)}>
        <div id={ELEM_ID_CONFIG_EDITOR} style={configDialogStyle.editor} />
      </Dialog>
    )
  }
}
