import React, { PropTypes, } from 'react'
import { Link, } from 'react-router'
import { connect, } from 'react-redux'
import { bindActionCreators, } from 'redux'

import JobList from '../../components/JobPage/JobList'
import JobHeader from '../../components/JobPage/JobHeader'
import Paginator from '../../components/Common/Paginator'
import EditorDialog, { EDITOR_DIALOG_MODE, } from '../../components/Common/EditorDialog'
import ConfirmDialog, { CONFIRM_DIALOG_MODE, } from '../../components/Common/ConfirmDialog'
import Snackbar, { CLOSABLE_SNACKBAR_MODE, } from '../../components/Common/ClosableSnackbar'

import { JOB_STATE_PROPERTY, } from '../../reducers/JobReducer'

import Actions, { ACTION_SELECTOR, } from '../../actions'
import * as style from './style'

class JobPage extends React.Component {
  static propTypes = {
    actions: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
    paginator: PropTypes.object.isRequired,
    filterKeyword: PropTypes.string.isRequired,
    editorDialog: PropTypes.object.isRequired,
    confirmDialog: PropTypes.object.isRequired,
    snackbar: PropTypes.object.isRequired,
    sortingStrategy: PropTypes.object.isRequired,
    containerSelector: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)

    this.handlePageOffsetChange = this.handlePageOffsetChange.bind(this)
  }

  handlePageOffsetChange(newPageOffset) {
    const { actions, } = this.props
    const payload = { newPageOffset, }
    actions.changePageOffset(payload)
  }

  render() {
    const {
      actions, jobs, paginator, filterKeyword,
      sortingStrategy, containerSelector,
      editorDialog, confirmDialog, snackbar,
    } = this.props

    const {
      itemCountPerPage, currentPageOffset, currentItemOffset,
    } = paginator

    const regex = new RegExp(filterKeyword)

    /** 1. filter, slice jobs */
    const filtered = jobs.filter(job => {
      const searchArea = JSON.stringify(job)
      return regex.test(searchArea)
    })

    const sliced = filtered.slice(currentItemOffset, currentItemOffset + itemCountPerPage)

    /** 2. draw dialogs, snackbar */
    const editorDialogDOM = (EDITOR_DIALOG_MODE.CLOSE !== editorDialog.dialogMode) ?
      (<EditorDialog {...editorDialog} actions={actions} />) : null

    const confirmDialogDOM = (CONFIRM_DIALOG_MODE.CLOSE !== confirmDialog.dialogMode) ?
      (<ConfirmDialog {...confirmDialog} actions={actions} />) : null

    const snackbarDOM = (CLOSABLE_SNACKBAR_MODE.CLOSE !== snackbar.snackbarMode) ?
      (<Snackbar {...snackbar} closeHandler={actions.closeSnackbar} />) : null

    return (
      <div>
        <JobHeader sortingStrategy={sortingStrategy}
                   containerSelector={containerSelector}
                   filteredJobs={filtered}
                   filterKeyword={filterKeyword}
                   startAllJobs={actions.startAllJobs}
                   stopAllJobs={actions.stopAllJobs}
                   filterJob={actions.filterJob}
                   sortJob={actions.sortJob}
                   changeContainer={actions.changeContainer}
                   openEditorDialogToCreate={actions.openEditorDialogToCreate} />

        <JobList filterKeyword={filterKeyword} jobs={sliced} actions={actions} />
        <div className="center" style={style.paginator}>
          <Paginator itemCountPerPage={itemCountPerPage}
                     currentPageOffset={currentPageOffset}
                     currentItemOffset={currentItemOffset}
                     totalItemCount={filtered.length}
                     handler={this.handlePageOffsetChange} />
        </div>
        {editorDialogDOM}
        {confirmDialogDOM}
        {snackbarDOM}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    jobs: state.job[JOB_STATE_PROPERTY.JOB_ITEMS],
    paginator: state.job[JOB_STATE_PROPERTY.PAGINATOR],
    filterKeyword: state.job[JOB_STATE_PROPERTY.FILTER],
    editorDialog: state.job[JOB_STATE_PROPERTY.EDITOR_DIALOG],
    confirmDialog: state.job[JOB_STATE_PROPERTY.CONFIRM_DIALOG],
    snackbar: state.job[JOB_STATE_PROPERTY.SNACKBAR],
    sortingStrategy: state.job[JOB_STATE_PROPERTY.SORTER],
    containerSelector: state.job[JOB_STATE_PROPERTY.CONTAINER_SELECTOR],
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions[ACTION_SELECTOR.job], dispatch),
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JobPage)

