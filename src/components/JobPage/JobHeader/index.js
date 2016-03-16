import React, { PropTypes, } from 'react'
import RaisedButton from 'material-ui/lib/raised-button'
import Popover from 'material-ui/lib/popover/popover'
import PopoverAnimationFromTop from 'material-ui/lib/popover/popover-animation-from-top'

import Filter from '../../Common/Filter'
import Sorter from '../../Common/Sorter'
import * as style from './style'

import JobSortingStrategies from '../../../constants/JobSortStrategies'
import { JOB_PROPERTY, isRunning, } from '../../../reducers/JobReducer/job'

/** TODO filter, */
export default class JobHeader extends React.Component {
  static propTypes = {
    sortingStrategy: PropTypes.string.isRequired,
    jobs: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  }

  static createSummaryWithPopover(jobs, stopAllPopoverDOM) {
    const totalJobCount = jobs.length
    const runningJobCount = jobs.filter(job => isRunning(job)).length

    return (
      <div style={style.summaryContainer}>
        <span style={style.summaryText}>Running</span>
        <span style={style.summaryRunningJob}> {runningJobCount}</span>
        <span style={style.summaryText}> of {totalJobCount} Jobs</span>
        {stopAllPopoverDOM}
      </div>
    )
  }

  /** create stop/start all button */
  static createActionAllButton(openButtonLabel,
                               open, anchorEl,
                               openHandler, closeHandler,
                               popoverButtonHandler) {

    return (
      <span style={style.stopAllPopover.container}>
        <RaisedButton labelStyle={style.stopAllPopover.openButtonLabel}
                      primary
                      onTouchTap={openHandler} label={openButtonLabel} />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onRequestClose={closeHandler}
          animation={PopoverAnimationFromTop} >
          <div style={style.stopAllPopover.popover}>
            <RaisedButton style={style.stopAllPopover.popoverButton}
                          labelStyle={style.stopAllPopover.popoverButtonLabel}
                          onClick={popoverButtonHandler}
                          secondary label="ARE YOU SURE ?"/>
          </div>
        </Popover>
      </span>
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

    actions.startAllJobs()
  }

  handleStopAllJobs() {
    const { actions, } = this.props
    this.setState({ open: false, })

    actions.stopAllJobs()
  }

  handleFilterChange(filterKeyword) {
    const payload = { filterKeyword, }
    const { actions, } = this.props

    actions.filterJob(payload)
  }

  handleSorterChange(strategy) {
    const payload = { strategy, }
    const { actions, } = this.props

    actions.sortJob(payload)
  }

  render() {
    const { sortingStrategy, jobs, } = this.props
    const { open, anchorEl, } = this.state


    /** 1. create popover */
    const isAtLeastOneJobIsRunning= jobs.reduce((acc, job) => {
      return acc || isRunning(job)
    }, false)

    const popoverOpenLabel = (isAtLeastOneJobIsRunning) ?
      'STOP ALL JOBS' : 'START ALL JOBS'
    const popoverHandler = (isAtLeastOneJobIsRunning) ?
      this.handleStopAllJobs.bind(this) : this.handleStartAllJobs.bind(this)

    const popoverDOM = JobHeader.createActionAllButton(
      popoverOpenLabel,
      open,
      anchorEl,
      this.handlePopoverOpen.bind(this),
      this.handlePopoverClose.bind(this),
      popoverHandler
    )

    /** 2. draw summary with popover */
    const summaryWithPopover = JobHeader.createSummaryWithPopover(jobs, popoverDOM)

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
