import React, { PropTypes, } from 'react'

import ListItem from 'material-ui/lib/lists/list-item'
import Divider from 'material-ui/lib/divider'
import Checkbox from 'material-ui/lib/checkbox'
import Toggle from 'material-ui/lib/toggle'
import FontIcon from 'material-ui/lib/font-icon'

import * as style from './style'
import { JobItemColors, } from '../../../constants/theme'


/** extract getInactiveState functions for testability */
export function isReadonly({ inTransition, disabled, running, }) {
  return inTransition || disabled || running
}

export function isDisableToggleInactive ({ inTransition, running, }) {
  return  inTransition || running
}
export function isDisableToggleDefaultToggled({ disabled, running, }) {
  return !running && disabled
}

export function isRunningToggleInactive ({ inTransition, disabled, }) {
  return inTransition || disabled

}
export function isRunningToggleDefaultToggled({ disabled, running, }) {
  return !disabled && running
}


export default class JobItem extends React.Component {
  static propTypes = {
    tags: PropTypes.array,
    name: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    running: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    inTransition: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  }

  static getJobCommandColor(inactive) {
    return (inactive) ?
      JobItemColors.inactiveJobCommandColor : JobItemColors.activeJobCommandColor
  }

  static createRemoveButton(index, inactive, handler) {

    /**
     * since updating inline-style does't update DOM element,
     * we have to create <FontIcon /> every time to update remove icon color
     */
    const removeIcon = (inactive) ?
      (<FontIcon style={{color: JobItemColors.inactiveRemoveIcon, }}
                 className="material-icons">delete</FontIcon>) :
      (<FontIcon style={{color: JobItemColors.activeRemoveIcon, }}
                 className="material-icons">delete</FontIcon>)

    const commandColor = JobItem.getJobCommandColor(inactive)

    return (
      <ListItem key={index}
                style={{color: commandColor, fontWeight: style.fontWeight,}}
                disabled={inactive}
                primaryText="Remove"
                rightIcon={removeIcon}
                onClick={handler} />
    )
  }

  static createDisableToggle(index, inactive, toggled, handler) {

    const disableToggle = (<Toggle onToggle={handler}
                                   disabled={inactive}
                                   defaultToggled={toggled} />)


    const commandColor = JobItem.getJobCommandColor(inactive)

    return (
      <ListItem key={index}
                style={{color: commandColor, fontWeight: style.fontWeight,}}
                primaryText="Readonly"
                rightToggle={disableToggle} />
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

  static createSpinIcon({ running, disabled, }) {
    return (!disabled && running) ? (<FontIcon style={{color: JobItemColors.runningSpin,}} className="fa fa-circle-o-notch fa-spin" />) :
      (!running && !disabled)  ? (<FontIcon style={{color: JobItemColors.waitingSpin,}} className="fa fa-circle-o-notch" />) :
        (<FontIcon className="fa fa-circle-o-notch" />)
  }

  handleDisableToggleChange() {
    const { name, actions, disabled, } = this.props

    const payload  = { name, }

    if (disabled) actions.enableJob(payload)
    else actions.disableJob(payload)
  }

  handleRunningToggleChange() {
    const { name, actions, running, } = this.props

    const payload  = { name, }

    if (running) actions.stopJob(payload)
    else actions.startJob(payload)
  }

  handleRemoveButtonClick(event) {
    const { name, actions, } = this.props

    const payload = { name, }

    actions.removeJob(payload)
  }

  handleItemClick(event) {
    const { actions, name, config, } = this.props

    /** check current config is readonly */
    const readonly = isReadonly(this.props)
    const payload = { name, config, readonly, }

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

    const { name, tags, } = this.props

    /** 1. Remove Button */

    const readonly = isReadonly(this.props)
    const removeButton = JobItem.createRemoveButton(
      0, readonly, this.handleRemoveButtonClick.bind(this))

    /** 2. Disable Toggle */

    const disableToggleInactive = isDisableToggleInactive(this.props)
    const disableToggleDefaultToggled = isDisableToggleDefaultToggled(this.props)

    const disableToggle = JobItem.createDisableToggle(
      1, disableToggleInactive, disableToggleDefaultToggled,
      this.handleDisableToggleChange.bind(this))

    /** 3. Running Toggle */

    const runningToggleInactive = isRunningToggleInactive(this.props)
    const runningToggleDefaultToggled = isRunningToggleDefaultToggled(this.props)
    const runningToggle = JobItem.createRunningToggle(
      2, runningToggleInactive, runningToggleDefaultToggled,
      this.handleRunningToggleChange.bind(this))

    /** 4. spin */
    const spinIcon = JobItem.createSpinIcon(this.props)

    return (
      <ListItem onClick={this.handleItemClick.bind(this)}
                primaryText={name}
                secondaryText={tags.join(', ')}
                leftIcon={spinIcon}
                nestedItems={[runningToggle, disableToggle, removeButton,]} />
    )
  }
}
