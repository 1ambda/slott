import React, { PropTypes, } from 'react'

import ListItem from 'material-ui/lib/lists/list-item'
import Divider from 'material-ui/lib/divider'
import Checkbox from 'material-ui/lib/checkbox'
import Toggle from 'material-ui/lib/toggle'
import FontIcon from 'material-ui/lib/font-icon'

import * as style from './style'
import { JobItemColors, } from '../../../constants/theme'

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

  static createRemoveButton(index, running, disabled, inTransition) {
    const isRemoveIconInactive =  inTransition || disabled || running

    /**
     * since updating inline-style does't update DOM element,
     * we have to create <FontIcon /> every time to update remove icon color
     */

    const inactive = (inTransition || (disabled || running))

    const removeIcon = (inactive) ?
      (<FontIcon style={{color: JobItemColors.inactiveRemoveIcon, }}
                 className="material-icons">delete</FontIcon>) :
      (<FontIcon style={{color: JobItemColors.activeRemoveIcon, }}
                 className="material-icons">delete</FontIcon>)

    const commandColor = JobItem.getJobCommandColor(inactive)

    return (
      <ListItem key={index}
                style={{color: commandColor, fontWeight: style.fontWeight,}}
                disabled={isRemoveIconInactive}
                primaryText="Remove"
                rightIcon={removeIcon} />
    )
  }

  static createDisableToggle(index, running, disabled, inTransition, handler) {

    const inactive = inTransition || running
    const disableToggle = (<Toggle onToggle={handler}
                                   disabled={inactive}
                                   defaultToggled={!running && disabled} />)


    const commandColor = JobItem.getJobCommandColor(inactive)

    return (
      <ListItem key={index}
                style={{color: commandColor, fontWeight: style.fontWeight,}}
                primaryText="Disabled"
                rightToggle={disableToggle} />
    )
  }

  static createRunningToggle(index, running, disabled, inTransition, handler) {

    const inactive = inTransition || disabled

    const runningToggle = (<Toggle onToggle={handler}
                                   disabled={inactive}
                                   defaultToggled={!disabled && running} />)

    const commandColor = JobItem.getJobCommandColor(inactive)

    return (
      <ListItem key={index}
                style={{color: commandColor, fontWeight: style.fontWeight,}}
                primaryText="Running"
                rightToggle={runningToggle} />
    )
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

  handleClick(event) {
    const { actions, name, tags, config, running, disabled, inTransition, } = this.props

    const readonly = (inTransition || (disabled || running))
    const payload = { name, config, readonly, }

    /**
     * preventDefault hack
     *
     * since we can't controll nestedListToggle event in current material-ui version (0.14.4)
     * we have to avoid opening dialog when nestedListToggle is clicked
     */

    if (event.dispatchMarker.includes('Text'))
      actions.openConfigDialog(payload)
  }

  handleNestedListToggle(a, b) {
    //console.log(a)
  }

  render() {

    const { name, tags, config, running, disabled, inTransition, } = this.props

    const nestedItems = [
      JobItem.createRemoveButton(0, running, disabled, inTransition),
      JobItem.createDisableToggle(1, running, disabled, inTransition, this.handleDisableToggleChange.bind(this)),
      JobItem.createRunningToggle(2, running, disabled, inTransition, this.handleRunningToggleChange.bind(this)),
    ]

    const spinIcon =
      (!disabled && running) ? (<FontIcon style={{color: JobItemColors.runningSpin,}} className="fa fa-circle-o-notch fa-spin" />) :
        (!running && !disabled)  ? (<FontIcon style={{color: JobItemColors.waitingSpin,}} className="fa fa-circle-o-notch" />) :
      (<FontIcon className="fa fa-circle-o-notch" />)

    const tagText = tags.join(', ')

    return (
      <ListItem onClick={this.handleClick.bind(this)}
                primaryText={name}
                onNestedListToggle={this.handleNestedListToggle.bind(this)}
                secondaryText={tagText}
                leftIcon={spinIcon}
                nestedItems={nestedItems} />
    )
  }
}
