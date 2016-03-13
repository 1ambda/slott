import React, { PropTypes, } from 'react'
import ReactDOM from 'react-dom'

import 'jsoneditor/dist/jsoneditor.css'
import JSONEditor from 'jsoneditor/dist/jsoneditor.js'

import FlatButton from 'material-ui/lib/flat-button'
import Dialog from 'material-ui/lib/dialog'

const ELEM_ID_CONFIG_EDITOR = 'config-editor'
import * as configDialogStyle from './style'

export default class ConfigDialog extends React.Component {
  static propTypes = {
    
  }

  constructor(props) {
    super(props)
    this.state = { open: true, }
  }

  componentDidMount() {
    const json = {
      'array': [1, 2, 3,],
      'boolean': true,
      'null': null,
      'number1': 123,
      'number2': 123,
      'number3': 123,
      'number4': 123,
      'number5': 123,
      'number6': 123,
      'number8': 123,
      'number9': 123,
      'number10': 123,
      'number11': 123,
      'number12': 123,
      'object': {'a': 'b', 'c': 'd',},
      'string': 'Hello World'
    }

    const options = {
      search: false,
      mode: 'tree',
      modes: ['code', 'view',  'tree',],
      onError: function (err) {
        alert(err.toString());
      },
      onModeChange: function (newMode, oldMode) {
        console.log('Mode switched from', oldMode, 'to', newMode);
      },
    }

    const editor = new JSONEditor(document.getElementById(ELEM_ID_CONFIG_EDITOR), options, json)
  }

  handleClose() {
    this.setState({open: false, })
  }

  render() {
    const actions = [
      <FlatButton
        label="Cancel"
        secondary={true}
        onTouchTap={this.handleClose.bind(this)}
        />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose.bind(this)}
        />,
    ]

    return (

      <Dialog
        title="title1"
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose.bind(this)} >
        <div id={ELEM_ID_CONFIG_EDITOR} style={configDialogStyle.editor}></div>
      </Dialog>
    )
  }
}
