import React, { PropTypes, } from 'react'
import { Link, IndexLink, } from 'react-router'

import FlatButton from 'material-ui/lib/flat-button'
import Toolbar from 'material-ui/lib/toolbar/toolbar'
import ToolbarGroup from 'material-ui/lib/toolbar/toolbar-group'
import ToolbarSeparator from 'material-ui/lib/toolbar/toolbar-separator'
import ToolbarTitle from 'material-ui/lib/toolbar/toolbar-title'

import IconButton from 'material-ui/lib/icon-button'
import NavigationClose from 'material-ui/lib/svg-icons/navigation/close'
import IconMenu from 'material-ui/lib/menus/icon-menu'
import MoreVertIcon from 'material-ui/lib/svg-icons/navigation/more-vert'
import MenuItem from 'material-ui/lib/menus/menu-item'

import * as style from './style.js'

export default class NavBar extends React.Component {

  static propTypes = {

  }

  render() {
    return (
      <Toolbar style={style.navbar}>
        <ToolbarGroup firstChild float="left">
          <ToolbarTitle text={<IndexLink to="/" style={style.text}>Slott</IndexLink>}
                        style={style.title} />
          <FlatButton disabled label={<Link to="/job" style={style.text}>Job</Link>}
                      style={style.linkButton} />
          <FlatButton disabled label={<Link to="/history" style={style.text}>History</Link>}
                      style={style.linkButton} />
        </ToolbarGroup>
        <ToolbarGroup float="right">
          <IconMenu
            style={style.iconMenu}
            iconButtonElement={<IconButton iconStyle={style.icon} ><MoreVertIcon /></IconButton>} >
            <MenuItem style={style.iconMenuItem} primaryText="Settings" />
            <MenuItem style={style.iconMenuItem} primaryText="Sign out" />
          </IconMenu>
        </ToolbarGroup>
      </Toolbar>
    )
  }
}


