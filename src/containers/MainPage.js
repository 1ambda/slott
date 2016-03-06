import React, { Component, PropTypes, } from 'react'
import { connect, } from 'react-redux'
import { bindActionCreators, } from 'redux'

import * as actions from '../actions/actions'

class MainPage extends Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    appState: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div>Hello World!</div>
    )
  }
}

function mapStateToProps(state) {
  return {
    appState: state.job,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainPage)
