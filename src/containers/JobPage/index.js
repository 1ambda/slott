import React, { PropTypes, } from 'react'
import { Link, } from 'react-router'
import { connect, } from 'react-redux'
import { bindActionCreators, } from 'redux'

import JobList from '../../components/JobPage/JobList'
import JobHeader from '../../components/JobPage/JobHeader'
import Paginator from '../../components/Common/Paginator'
import ConfigDialog from '../../components/JobPage/ConfigDialog'
import RemoveDialog from '../../components/JobPage/RemoveDialog'

import { JOB_PROPERTY, } from '../../reducers/JobReducer/job'

import * as JobActions from '../../actions/JobActions'
import * as style from './style'

class JobPage extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
    paginator: PropTypes.object.isRequired,
    filterKeyword: PropTypes.string.isRequired,
    sortingStrategy: PropTypes.string.isRequired,
    configDialog: PropTypes.object.isRequired,
    removeDialog: PropTypes.object.isRequired,
  }

  handlePageOffsetChange(newPageOffset) {
    const { actions, } = this.props
    actions.changePageOffset({ newPageOffset, })
  }

  render() {
    const { actions, jobs, paginator, filterKeyword, sortingStrategy,
      configDialog, removeDialog, } = this.props
    const { itemCountPerPage, currentPageOffset, currentItemOffset, } = paginator

    /** 1. filter jobs */
    const filtered = jobs.filter(job => {
      const searchArea = `${job[JOB_PROPERTY.name]} ${job[JOB_PROPERTY.tags].join(' ')}`
      return (searchArea.includes(filterKeyword))
    })

    /** 2. select jobs to be curated */
    const sliced = filtered.slice(currentItemOffset, currentItemOffset + itemCountPerPage)

    /** 3. draw dialogs */
    const configDialogDOM = (configDialog.opened) ?
      (<ConfigDialog {...configDialog} actions={actions} />) : null

    const removeDialogDOM = (removeDialog.opened) ?
      (<RemoveDialog {...removeDialog} actions={actions} />) : null

    return (
      <div>
        <JobHeader sortingStrategy={sortingStrategy} jobs={jobs} actions={actions} />
        <JobList filterKeyword={filterKeyword} jobs={sliced} actions={actions} />
        <div className="center" style={style.paginator}>
          <Paginator itemCountPerPage={itemCountPerPage}
                     currentPageOffset={currentPageOffset}
                     currentItemOffset={currentItemOffset}
                     totalItemCount={jobs.length}
                     handler={this.handlePageOffsetChange.bind(this)} />
        </div>
        {configDialogDOM}
        {removeDialogDOM}
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
    configDialog: state.job.configDialog,
    removeDialog: state.job.removeDialog,
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

