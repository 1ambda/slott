import React, { PropTypes, } from 'react'

import ListItem from 'material-ui/lib/lists/list-item'
import Divider from 'material-ui/lib/divider'
import Checkbox from 'material-ui/lib/checkbox'
import Toggle from 'material-ui/lib/toggle'
import FontIcon from 'material-ui/lib/font-icon'

import { JobItemColors, } from '../../constants/theme'
import * as style from './style'

export default class JobItem extends React.Component {
  static propTypes = {
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
                style={{color: commandColor,}}
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
                style={{color: commandColor,}}
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
                style={{color: commandColor,}}
                primaryText="Running"
                rightToggle={runningToggle} />
    )
  }

  handleDisableToggleChange(event, toggled) {
    const { name, actions, } = this.props

    const payload  = { name, }

    if (toggled) actions.disableJob(payload)
    else actions.enableJob(payload)
  }

  handleRunningToggleChange(event, toggled) {
    const { name, actions, } = this.props

    const payload  = { name, }

    if (toggled) actions.startJob(payload)
    else actions.stopJob(payload)
  }

  render() {

    const { name, config, running, disabled, inTransition, } = this.props

    const nestedItems = [
      JobItem.createRemoveButton(0, running, disabled, inTransition),
      JobItem.createDisableToggle(1, running, disabled, inTransition, this.handleDisableToggleChange.bind(this)),
      JobItem.createRunningToggle(2, running, disabled, inTransition, this.handleRunningToggleChange.bind(this)),
    ]

    const spinIcon = (!disabled && running) ?
      (<FontIcon style={{color: JobItemColors.spin,}} className="fa fa-circle-o-notch fa-spin" />) :
      (<FontIcon className="fa fa-circle-o-notch" />)

    return (
      <ListItem primaryText={name}
                leftIcon={spinIcon}
                nestedItems={nestedItems} />
    )
  }
}
