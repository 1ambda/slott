import React, { PropTypes, } from 'react'
import { Link, } from 'react-router'
import { connect, } from 'react-redux'
import { bindActionCreators, } from 'redux'

import Paginator from '../../components/Common/Paginator'
import JobList from '../../components/JobPage/JobList'
import JobHeader from '../../components/JobPage/JobHeader'
import JobFooter from '../../components/JobPage/JobFooter'
import * as JobActions from '../../actions/JobActions'
import * as style from './style'

class JobPage extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    paginator: PropTypes.object.isRequired,
    filterKeyword: PropTypes.string.isRequired,
    sortingStrategy: PropTypes.string.isRequired,
    jobs: PropTypes.array.isRequired,
  }

  handlePageOffsetChange(newPageOffset) {
    const { actions, } = this.props
    actions.changePageOffset({ newPageOffset, })
  }

  render() {
    const { actions, paginator, filterKeyword, sortingStrategy, jobs, } = this.props
    const { itemCountPerPage, currentPageOffset, currentItemOffset, } = paginator

    // TODO filter
    const sliced = jobs.slice(currentItemOffset, currentItemOffset + itemCountPerPage)

    return (
      <div>
        <JobHeader sortingStrategy={sortingStrategy} jobs={jobs} actions={actions} />
        <JobList filterKeyword={filterKeyword} jobs={sliced} actions={actions} />
        <JobFooter jobs={jobs} actions={actions} />
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
    filterKeyword: state.job.filterKeyword,
    sortingStrategy: state.job.sortingStrategy,
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

