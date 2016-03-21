import React, { PropTypes, } from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import Popover from 'material-ui/lib/popover/popover'
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top'

import Filter from '../../Common/Filter'
import Sorter from '../../Common/Sorter'
import * as style from './style'

import JobSortingStrategies from '../../../constants/JobSortStrategies'
import * as JobActions from '../../../actions/JobActions'
import { JOB_PROPERTY, isRunning, } from '../../../reducers/JobReducer/job'

export default class JobHeader extends React.Component {
  static propTypes = {
    sortingStrategy: PropTypes.string.isRequired,
    jobs: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  }

  static createSummaryDOM(jobs, createButton, actionAllButton) {
    const totalJobCount = jobs.length
    const runningJobCount = jobs.filter(job => isRunning(job)).length

    return (
      <div style={style.summaryContainer}>
        <span>Running</span>
        <span style={style.summaryRunningJob}> {runningJobCount}</span>
        <span> of {totalJobCount} Jobs</span>
        <span style={style.buttonContainer}> {createButton} </span>
        <span style={style.buttonContainer}> {actionAllButton} </span>
      </div>
    )
  }

  /** create stop/start all button */
  static createActionAllButton(openButtonLabel,
                               open, anchorEl,
                               openHandler, closeHandler,
                               popoverButtonHandler) {

    return (
      <RaisedButton labelStyle={style.buttonLabel}
                    primary
                    onTouchTap={openHandler} label={openButtonLabel}>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onRequestClose={closeHandler}
          animation={PopoverAnimationFromTop} >
          <div style={style.popover}>
            <RaisedButton labelStyle={style.buttonLabel}
                          onClick={popoverButtonHandler}
                          secondary label="ARE YOU SURE ?"/>
          </div>
        </Popover>
      </RaisedButton>
    )
  }

  constructor(props) {
    super(props)

    /** manage popover state itself */
    this.state = { open: false, }
  }

  handlePopoverOpen(event) {
    this.setState({ open: true, anchorEl: event.currentTarget, })
  }

  handlePopoverClose() {
    this.setState({ open: false, })
  }

  handleStartAllJobs() {
    const { actions, } = this.props
    this.setState({ open: false, })

    actions[JobActions.startAllJobs.name]()
  }

  handleStopAllJobs() {
    const { actions, } = this.props
    this.setState({ open: false, })

    actions[JobActions.stopAllJobs.name]()
  }

  handleCreateJob() {
    const { actions, } = this.props

    actions[JobActions.openEditorDialogToCreate.name]()
  }

  handleFilterChange(filterKeyword) {
    const payload = { filterKeyword, }
    const { actions, } = this.props

    actions[JobActions.filterJob.name](payload)
  }

  handleSorterChange(strategy) {
    const payload = { strategy, }
    const { actions, } = this.props

    actions[JobActions.sortJob.name](payload)
  }

  render() {
    const { sortingStrategy, jobs, } = this.props
    const { open, anchorEl, } = this.state


    /** 1. create `CREATE` button */

    const createButton = (
      <RaisedButton labelStyle={style.buttonLabel}
                    secondary label={"CREATE"}
                    onTouchTap={this.handleCreateJob.bind(this)} />)

    /** 2. create popover */
    const isAtLeastOneJobIsRunning= jobs.reduce((acc, job) => {
      return acc || isRunning(job)
    }, false)

    const actionAllButtonLabel = (isAtLeastOneJobIsRunning) ?
      'STOP  ALL JOBS' : 'START ALL JOBS'
    const popoverHandler = (isAtLeastOneJobIsRunning) ?
      this.handleStopAllJobs.bind(this) : this.handleStartAllJobs.bind(this)

    const actionAllButton = JobHeader.createActionAllButton(
      actionAllButtonLabel,
      open,
      anchorEl,
      this.handlePopoverOpen.bind(this),
      this.handlePopoverClose.bind(this),
      popoverHandler
    )

    /** 3. draw summary with popover */
    const summaryWithPopover = JobHeader.createSummaryDOM(jobs, createButton, actionAllButton)

    return (
      <div>
        <div style={style.title}>
          Job
        </div>
        <div>
          <Filter handler={this.handleFilterChange.bind(this)}
                  floatingLabel="Insert Filter"
                  style={style.filterInput} />
          <Sorter handler={this.handleSorterChange.bind(this)}
                  style={style.sorter}
                  labelStyle={style.sorterLabel}
                  floatingLabel="Sort by"
                  floatingLabelStyle={style.sorterFloatingLabel}
                  strategies={JobSortingStrategies}
                  currentStrategy={sortingStrategy} />
        </div>
        {summaryWithPopover}
      </div>
    )
  }
}
