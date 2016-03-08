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
    index: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    config: PropTypes.object.isRequired,
    running: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
    inTransition: PropTypes.bool.isRequired,
    actions: PropTypes.object.isRequired,
  }

  handleDisableToggleChange(event, toggled) {
    const { name, actions, } = this.props

    if (toggled) actions.disableJob(name)
    else actions.enableJob(name)
  }

  handleRunningToggleChange(event, toggled) {
    const { name, actions, } = this.props

    if (toggled) actions.startJob(name)
    else actions.stopJob(name)
  }

  render() {

    const { name, config, running, disabled, inTransition, index, } = this.props

    const isRemoveIconInactive =  inTransition || disabled || running
    const isDisableToggleInactive = inTransition || running
    const isRunningToggleInactive = inTransition || disabled

    const removeIconColor = JobItemColors.activeRemoveIcon

    const removeIcon = (<FontIcon style={{color: removeIconColor}}
                                  className="material-icons">delete</FontIcon>)
    const disableToggle = (<Toggle onToggle={this.handleDisableToggleChange.bind(this)}
                                   disabled={isDisableToggleInactive}
                                   defaultToggled={!running && disabled} />)
    const runningToggle = (<Toggle onToggle={this.handleRunningToggleChange.bind(this)}
                                   disabled={isRunningToggleInactive}
                                   defaultToggled={!disabled && running} />)

    const nestedItems = [
      (<ListItem key={0}
                 disabled={isRemoveIconInactive}
                 primaryText="Remove"
                 rightIcon={removeIcon} />),
      (<ListItem key={1}
                 primaryText="Disabled"
                 rightToggle={disableToggle} />),
      (<ListItem key={2}
                 primaryText="Running"
                 rightToggle={runningToggle} />),
    ]

    const spinIcon = (!disabled && running) ?
      (<FontIcon style={{color: JobItemColors.spin,}} className="fa fa-circle-o-notch fa-spin" />) :
      (<FontIcon className="fa fa-circle-o-notch" />)

    return (
      <ListItem key={index}
                primaryText={name}
                leftIcon={spinIcon}
                nestedItems={nestedItems} />
    )
  }
}
