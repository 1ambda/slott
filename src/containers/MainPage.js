import React, { PropTypes, } from 'react'
import { connect, } from 'react-redux'
import { bindActionCreators, } from 'redux'

import * as actions from '../actions'

/** responsible for drawing job summary */
class MainPage extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div>Main Page</div>
    )
  }
}

function mapStateToProps(state) {
  return {
    jobs: state.job.items
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
