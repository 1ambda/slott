import React, { PropTypes, } from 'react'
import { connect, } from 'react-redux'
import { bindActionCreators, } from 'redux'

import * as actions from '../actions'

import ConfigDialog from '../components/JobPage/ConfigDialog'


class MainPage extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  }

  render() {

    return (
      <ConfigDialog />

    )
  }
}

function mapStateToProps(state) {
  return {
    appState: {}, /** TODO */
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
