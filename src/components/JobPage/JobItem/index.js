import React, { PropTypes, } from 'react'

import ListItem from 'material-ui/lib/lists/list-item'
import Divider from 'material-ui/lib/divider'
import Checkbox from 'material-ui/lib/checkbox'
import Toggle from 'material-ui/lib/toggle'
import FontIcon from 'material-ui/lib/font-icon'

import * as style from './style'
import { JobItemColors, } from '../../../constants/theme'

import { JOB_PROPERTY, isRunning, isStopped, isWaiting, isSwitching, } from '../../../reducers/JobReducer/job'

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
     * we have to create <FontIcon /> every time to update remove icon color
     */
    const removeIcon = (readonly) ?
      (<FontIcon style={{color: JobItemColors.inactiveRemoveIcon, }}
                 className="material-icons">delete</FontIcon>) :
      (<FontIcon style={{color: JobItemColors.activeRemoveIcon, }}
                 className="material-icons">delete</FontIcon>)

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

    if (isWaiting(job)) actions.openRemoveDialog(job)
  }

  handleItemClick(event) {
    const { actions, job, } = this.props

    /** check current config is readonly */
    const readonly = isReadonly(job)
    const payload = { job, readonly, }

    /**
     * preventDefault hack
     *
     * since we can't control nestedListToggle event in current material-ui version (0.14.4)
     * we have to avoid opening dialog when nestedListToggle is clicked
     */
    if (event.dispatchMarker.includes('Text'))
      actions.openConfigDialog(payload)
  }

  render() {
    const { job, } = this.props
    const tags = job[JOB_PROPERTY.tags]
    const name = job[JOB_PROPERTY.name]

    /** 1. Remove Button */
    const readonly = isReadonly(job)
    const removeButton = JobItem.createRemoveButton(
      0, readonly, this.handleRemoveButtonClick.bind(this))

    /** 2. Disable Toggle */
    const readonlyToggleInactive = isReadonlyToggleDisabled(job)
    const readonlyToggleDefaultToggled = isReadonlyToggleDefaultToggled(job)

    const readonlyToggle = JobItem.createReadonlyToggle(
      1, readonlyToggleInactive, readonlyToggleDefaultToggled,
      this.handleReadonlyToggleChange.bind(this))

    /** 3. Running Toggle */
    const runningToggleInactive = isRunningToggleDisabled(job)
    const runningToggleDefaultToggled = isRunningToggleDefaultToggled(job)

    const runningToggle = JobItem.createRunningToggle(
      2, runningToggleInactive, runningToggleDefaultToggled,
      this.handleRunningToggleChange.bind(this))

    /** 4. spin */
    const spinIcon = JobItem.createSpinIcon(job)

    return (
      <ListItem onClick={this.handleItemClick.bind(this)}
                primaryText={name}
                secondaryText={tags.join(', ')}
                leftIcon={spinIcon}
                nestedItems={[runningToggle, readonlyToggle, removeButton,]} />
    )
  }
}
