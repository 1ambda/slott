import React, { PropTypes, } from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import { Popover, PopoverAnimationVertical, } from 'material-ui/Popover'

import Filter from '../../Common/Filter'
import Selector from '../../Common/Selector'
import * as style from './style'

import { isRunning, } from '../../../reducers/JobReducer/JobItemState'

export default class JobHeader extends React.Component {
  static propTypes = {
    sortingStrategy: PropTypes.object.isRequired,
    containerSelector: PropTypes.object.isRequired,
    filteredJobs: PropTypes.array.isRequired,
    filterKeyword: PropTypes.string.isRequired,
    startAllJobs: PropTypes.func.isRequired,
    stopAllJobs: PropTypes.func.isRequired,
    filterJob: PropTypes.func.isRequired,
    sortJob: PropTypes.func.isRequired,
    changeContainer: PropTypes.func.isRequired,
    openEditorDialogToCreate: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)

    /** manage popover state itself */
    this.state = { popoverOpened: false, }

    this.handleStartPopoverOpen = this.handleStartPopoverOpen.bind(this)
    this.handleStopPopoverOpen = this.handleStopPopoverOpen.bind(this)
    this.handlePopoverClose = this.handlePopoverClose.bind(this)

    this.handleCreateJob = this.handleCreateJob.bind(this)
    this.handleStartAllJobs = this.handleStartAllJobs.bind(this)
    this.handleStopAllJobs = this.handleStopAllJobs.bind(this)
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleSorterChange = this.handleSorterChange.bind(this)
    this.handleContainerSelectorChange = this.handleContainerSelectorChange.bind(this)
  }

  handleStartPopoverOpen(event) {
    this.setState({
      popoverOpened: true,
      popoverAnchorElem: event.currentTarget,
      popoverHandler: this.handleStartAllJobs,
    })
  }

  handleStopPopoverOpen(event) {
    this.setState({
      popoverOpened: true,
      popoverAnchorElem: event.currentTarget,
      popoverHandler: this.handleStopAllJobs,
    })
  }

  handlePopoverClose() {
    this.setState({ popoverOpened: false, })
  }

  handleStartAllJobs() {
    const { filteredJobs, startAllJobs, } = this.props
    this.setState({ popoverOpened: false, })
    const payload = { filteredJobs, }

    startAllJobs(payload)
  }

  handleStopAllJobs() {
    const { filteredJobs, stopAllJobs, } = this.props
    this.setState({ popoverOpened: false, })
    const payload = { filteredJobs, }

    stopAllJobs(payload)
  }

  handleCreateJob() {
    const { openEditorDialogToCreate, } = this.props

    openEditorDialogToCreate()
  }

  handleFilterChange(filterKeyword) {
    const { filterJob, } = this.props
    const payload = { filterKeyword, }

    filterJob(payload)
  }

  handleSorterChange(strategy) {
    const { sortJob, } = this.props
    const payload = { strategy, }

    sortJob(payload)
  }

  handleContainerSelectorChange(container) {
    const { changeContainer, } = this.props
    const payload = { container, }

    changeContainer(payload)
  }

  createCommandButtons() {
    return (
      <div style={style.commandButtonsContainer}>
        <RaisedButton labelStyle={style.commandButtonLabel}
                      label={"START ALL"}
                      style={style.commandButtonLeft}
                      backgroundColor={style.startAllButton.backgroundColor}
                      onTouchTap={this.handleStartPopoverOpen} />
        <RaisedButton labelStyle={style.commandButtonLabel}
                      primary label={"STOP ALL"}
                      style={style.commandButtonLeft}
                      onTouchTap={this.handleStopPopoverOpen} />
        <RaisedButton labelStyle={style.commandButtonLabel}
                      secondary label={"CREATE"}
                      style={style.commandRightButton}
                      onTouchTap={this.handleCreateJob} />
        <div style={{clear: 'both',}}></div>
      </div>
    )
  }

  createSummary() {
    const { filteredJobs, } = this.props

    const totalJobCount = filteredJobs.length
    const runningJobCount = filteredJobs.filter(job => isRunning(job)).length

    return (
      <div style={style.summaryContainer}>
        <span>Running</span>
        <span style={style.summaryRunningJob}> {runningJobCount}</span>
        <span> of {totalJobCount} Jobs</span>
      </div>
    )
  }

  createPopover() {
    const {
      popoverOpened, popoverAnchorElem, popoverHandler,
    } = this.state

    return (
        <Popover
          open={popoverOpened}
          anchorEl={popoverAnchorElem}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom', }}
          targetOrigin={{horizontal: 'left', vertical: 'top', }}
          onRequestClose={this.handlePopoverClose} >
          <div style={style.popoverContainer}>
            <RaisedButton backgroundColor={style.popoverButton.color}
                          labelStyle={style.popoverButton.labelStyle}
                          label="EXECUTE"
                          onTouchTap={popoverHandler} />
          </div>
        </Popover>
    )
  }

  render() {
    const { sortingStrategy, containerSelector, filterKeyword, } = this.props
    const summary = this.createSummary()
    const commandButtons = this.createCommandButtons()
    const popover = this.createPopover()

    const flotingLabel = (filterKeyword.trim() === '') ?
      'Insert Filter' : `Filtered by '${filterKeyword}'`

    return (
      <div>
        <div style={style.title}>
          Job
        </div>
        <div>
          <Filter handler={this.handleFilterChange}
                  floatingLabel={flotingLabel}
                  style={style.filterInput} />
          <Selector handler={this.handleContainerSelectorChange}
                    style={style.containerSelector}
                    labelStyle={style.containerSelectorLabel}
                    floatingLabel="Container"
                    floatingLabelStyle={style.selectorFloatingLabel}
                    strategies={containerSelector.availableContainers}
                    currentStrategy={containerSelector.selectedContainer} />
          <Selector handler={this.handleSorterChange}
                  style={style.selector}
                  labelStyle={style.selectorLabel}
                  floatingLabel="Sort by"
                  floatingLabelStyle={style.selectorFloatingLabel}
                  strategies={sortingStrategy.availableStrategies}
                  currentStrategy={sortingStrategy.selectedStrategy} />
        </div>
        {summary}
        {commandButtons}
        {popover}
      </div>
    )
  }
}
