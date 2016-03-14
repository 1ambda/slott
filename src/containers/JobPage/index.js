import React, { PropTypes, } from 'react'
import { Link, } from 'react-router'
import { connect, } from 'react-redux'
import { bindActionCreators, } from 'redux'

import JobList from '../../components/JobPage/JobList'
import JobHeader from '../../components/JobPage/JobHeader'
import JobFooter from '../../components/JobPage/JobFooter'
import Paginator from '../../components/Common/Paginator'
import ConfigDialog from '../../components/Common/ConfigDialog'

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
  }

  handlePageOffsetChange(newPageOffset) {
    const { actions, } = this.props
    actions.changePageOffset({ newPageOffset, })
  }

  handleConfigDialogClose() {
    const { actions, } = this.props
    actions.closeConfigDialog()
  }

  handleConfigDialogUpdate(config) {
    console.log(config)
  }

  render() {
    const { actions, jobs, paginator, filterKeyword, sortingStrategy, configDialog, } = this.props
    const { itemCountPerPage, currentPageOffset, currentItemOffset, } = paginator

    /** 1. filter jobs */
    const filtered = jobs.filter(job => {
      const searchArea = `${job.name} ${job.tags.join(' ')}`
      return (searchArea.includes(filterKeyword))
    })

    /** 2. select jobs to be curated */
    const sliced = filtered.slice(currentItemOffset, currentItemOffset + itemCountPerPage)

    /** 3. draw ConfigDialog */
    const configDialogDOM =  (configDialog.opened) ?
      (<ConfigDialog actions={actions}
                      updateHandler={this.handleConfigDialogUpdate.bind(this)}
                      closeHandler={this.handleConfigDialogClose.bind(this)}
          {...Object.assign({}, configDialog, {opened: undefined, })} />) : null

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
        {configDialogDOM}
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

