import React, { PropTypes, } from 'react'
import { Link, } from 'react-router'
import { connect, } from 'react-redux'
import { bindActionCreators, } from 'redux'

import JobList from '../components/JobList'

import * as actions from '../actions'

const jobs = [
  {name: 'tmap-tsg', config: {}, running: true, disabled: false, },
  {name: '11st-ch-encrypted', config: {}, running: false, disabled: false, },
  {name: 'rake-metric', config: {}, running: false, disabled: true, },
]

class JobPage extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    jobs: PropTypes.object.isRequired,
  }

  static createItem() {

  }

  static createList() {

  }

  static createPaginator() {

  }

  render() {
    return (
      <JobList jobs={jobs} />
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
    actions: bindActionCreators(actions, dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPage)

