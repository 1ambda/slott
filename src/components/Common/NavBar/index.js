import React, { PropTypes, } from 'react'
import { Link, } from 'react-router'

import FlatButton from 'material-ui/FlatButton'
import {Toolbar, ToolbarGroup, ToolbarTitle,} from 'material-ui/Toolbar'

import IconButton from 'material-ui/IconButton'
import IconMenu from 'material-ui/IconMenu'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import MenuItem from 'material-ui/MenuItem'

import * as Page from '../../../constants/Page'
import * as style from './style.js'
import * as Config from '../../../constants/Config'

export default class NavBar extends React.Component {
  render() {

    return (
      <Toolbar style={style.navbar}>
        <ToolbarGroup firstChild >
          <ToolbarTitle text={<Link to={`/${Page.MainPageRouting}`} style={style.text}>{Config.TITLE}</Link>}
                        style={style.title} />
          <FlatButton disabled label={<Link to={`/${Page.JobPageRouting}`} style={style.text}>Job</Link>}
                      style={style.linkButton} />
        </ToolbarGroup>
        <ToolbarGroup >
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


