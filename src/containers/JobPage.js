import React, { PropTypes, } from 'react'
import { Link, } from 'react-router'
import { connect, } from 'react-redux'
import { bindActionCreators, } from 'redux'

import JobList from '../components/JobList'
import Paginator from '../components/Paginator'

import * as JobActions from '../actions/JobActions'

class JobPage extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
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
    jobs: state.job.items,
    paginator: state.job.paginator,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(JobActions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPage)

