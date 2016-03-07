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
    config: PropTypes.string.isRequired,
    running: PropTypes.bool.isRequired,
    disabled: PropTypes.bool.isRequired,
  }

  render() {

    const { name, config, running, disabled, index, } = this.props

    const nestedItems = [
      (<ListItem key={0}
                 disabled={disabled}
                 primaryText="Remove"
                 rightIcon={<FontIcon className="material-icons">delete</FontIcon>} />),
      (<ListItem key={1}
                 primaryText="Disabled"
                 rightToggle={<Toggle defaultToggled={disabled} />} />),
      (<ListItem key={2}
                 primaryText="Running"
                 rightToggle={<Toggle disabled={disabled} defaultToggled={!disabled && running} />} />),
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
