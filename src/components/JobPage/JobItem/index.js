import React, { PropTypes, } from 'react'

import { List, ListItem, } from 'material-ui/List'
import Toggle from 'material-ui/Toggle'
import FontIcon from 'material-ui/FontIcon'
import Delete from 'material-ui/svg-icons/action/delete'

import * as style from './style'
import { JobItemColors, } from '../../../constants/Theme'

import {
  JOB_PROPERTY, isRunning, isStopped, isWaiting, isSwitching,
} from '../../../reducers/JobReducer/JobItemState'

/** extract getInactiveState functions for testability */
export function isReadonly(job) {
  return isSwitching(job) || isStopped(job) || isRunning(job)
}

export function isReadonlyToggleDisabled(job) {
  return isSwitching(job) || isRunning(job)
}
export function isReadonlyToggleDefaultToggled(job) {
  return isStopped(job)
}

export function isRunningToggleDisabled(job) {
  return isSwitching(job) || isStopped(job)
}
export function isRunningToggleDefaultToggled(job) {
  return isRunning(job)
}

export default class JobItem extends React.Component {
  static propTypes = {
    job: PropTypes.object.isRequired,
    actions: PropTypes.object.isRequired,
  }

  static getJobCommandColor(inactive) {
    return (inactive) ?
      JobItemColors.inactiveJobCommandColor : JobItemColors.activeJobCommandColor
  }

  static createRemoveButton(index, readonly, handler) {

    /**
     * since updating inline-style does't update DOM element,
     * we have to create <Delete /> every time to update remove icon color
     */
    const removeIcon = (readonly) ?
      (<Delete color={JobItemColors.inactiveRemoveIcon} />) :
      (<Delete color={JobItemColors.activeRemoveIcon} />)

    const commandColor = JobItem.getJobCommandColor(readonly)

    return (
      <ListItem key={index}
                style={{color: commandColor, fontWeight: style.fontWeight,}}
                disabled={readonly}
                primaryText="Remove"
                rightIcon={removeIcon}
                onClick={handler} />
    )
  }

  static createReadonlyToggle(index, inactive, toggled, handler) {

    const readonlyToggle = (<Toggle onToggle={handler}
                                   disabled={inactive}
                                   defaultToggled={toggled} />)


    const commandColor = JobItem.getJobCommandColor(inactive)

    return (
      <ListItem key={index}
                style={{color: commandColor, fontWeight: style.fontWeight,}}
                primaryText="Readonly"
                rightToggle={readonlyToggle} />
    )
  }

  static createRunningToggle(index, inactive, toggled, handler) {
    const runningToggle = (<Toggle onToggle={handler}
                                   disabled={inactive}
                                   defaultToggled={toggled} />)

    const commandColor = JobItem.getJobCommandColor(inactive)

    return (
      <ListItem key={index}
                style={{color: commandColor, fontWeight: style.fontWeight,}}
                primaryText="Running"
                rightToggle={runningToggle} />
    )
  }

  static createSpinIcon(job) {
    return (isRunning(job)) ? (<FontIcon style={{color: JobItemColors.runningSpin,}} className="fa fa-circle-o-notch fa-spin" />) :
      (isWaiting(job))  ? (<FontIcon style={{color: JobItemColors.waitingSpin,}} className="fa fa-circle-o-notch" />) :
        (<FontIcon className="fa fa-circle-o-notch" />)
  }

  constructor(props) {
    super(props)

    this.handleReadonlyToggleChange = this.handleReadonlyToggleChange.bind(this)
    this.handleRunningToggleChange = this.handleRunningToggleChange.bind(this)
    this.handleRemoveButtonClick = this.handleRemoveButtonClick.bind(this)
    this.handleItemClick = this.handleItemClick.bind(this)
  }

  handleReadonlyToggleChange() {
    const { job, actions, } = this.props

    /**
     * since material-ui toggle doesn't property work, (0.14.4)
     * we rely on the redux state instead of passed params of this callback
     * to send actions
     */
    if (isReadonly(job)) actions.unsetReadonly(job)
    else actions.setReadonly(job)
  }

  handleRunningToggleChange() {
    const { job, actions, } = this.props

    /**
     * since material-ui toggle doesn't property work, (0.14.4)
     * we rely on the redux state instead of passed params of this callback
     * to send actions
     */
    if (isRunning(job)) actions.stopJob(job)
    else actions.startJob(job)
  }

  handleRemoveButtonClick(event) {
    const { job, actions, } = this.props

    if (isWaiting(job)) actions.openConfirmDialogToRemove(job)
  }

  handleItemClick(event) {
    const { actions, job, } = this.props

    /** check current job is readonly */
    const readonly = isReadonly(job)
    const payload = { id: job[JOB_PROPERTY.id], readonly, }

    actions.openEditorDialogToEdit(payload)
  }

  render() {
    const { job, } = this.props
    const tags = job[JOB_PROPERTY.tags]
    const id = job[JOB_PROPERTY.id]

    /** 1. Remove Button */
    const readonly = isReadonly(job)
    const removeButton = JobItem.createRemoveButton(
      0, readonly, this.handleRemoveButtonClick)

    /** 2. Disable Toggle */
    const readonlyToggleInactive = isReadonlyToggleDisabled(job)
    const readonlyToggleDefaultToggled = isReadonlyToggleDefaultToggled(job)

    const readonlyToggle = JobItem.createReadonlyToggle(
      1, readonlyToggleInactive, readonlyToggleDefaultToggled,
      this.handleReadonlyToggleChange)

    /** 3. Running Toggle */
    const runningToggleInactive = isRunningToggleDisabled(job)
    const runningToggleDefaultToggled = isRunningToggleDefaultToggled(job)

    const runningToggle = JobItem.createRunningToggle(
      2, runningToggleInactive, runningToggleDefaultToggled,
      this.handleRunningToggleChange)

    /** 4. spin */
    const spinIcon = JobItem.createSpinIcon(job)

    /** 5. tags */
    const tagString = (tags) ? tags.join(', ') : null

    return (
      <ListItem onClick={this.handleItemClick}
                primaryText={id}
                secondaryText={tagString}
                leftIcon={spinIcon}
                nestedItems={[runningToggle, readonlyToggle, removeButton,]} />
    )
  }
}
