import React, { PropTypes, } from 'react'
import { Link, } from 'react-router'
import { connect, } from 'react-redux'
import { bindActionCreators, } from 'redux'

import JobList from '../../components/Job/JobList'
import Paginator from '../../components/Common/Paginator'
import * as JobActions from '../../actions/JobActions'
import * as style from './style'

class JobPage extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    paginator: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
  }

  handlePageOffsetChange(newPageOffset) {
    const { actions, } = this.props
    actions.changePageOffset({ newPageOffset, })
  }

  render() {
    const { jobs, actions, paginator, } = this.props
    const { itemCountPerPage, currentPageOffset, currentItemOffset, } = paginator

    const sliced = jobs.slice(currentItemOffset, currentItemOffset + itemCountPerPage)

    return (
      <div>
        <div>
          <JobList jobs={sliced} actions={actions} />
        </div>
        <div className="center" style={style.paginator}>
          <Paginator itemCountPerPage={itemCountPerPage}
                     currentPageOffset={currentPageOffset}
                     currentItemOffset={currentItemOffset}
                     totalItemCount={jobs.length}
                     handler={this.handlePageOffsetChange.bind(this)} />
        </div>
      </div>
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

