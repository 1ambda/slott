import React, { PropTypes, } from 'react'
import { Link, } from 'react-router'
import { connect, } from 'react-redux'
import { bindActionCreators, } from 'redux'

import JobList from '../components/JobList'

import * as actions from '../actions'

class JobPage extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
  }

  static createItem() {

  }

  static createList() {

  }

  static createPaginator() {

  }

  render() {
    const { jobs, actions, } = this.props

    return (
      <JobList jobs={jobs} actions={actions} />
    )
  }
}

function mapStateToProps(state) {
  return {
    jobs: state.jobs,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions.job, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPage)

