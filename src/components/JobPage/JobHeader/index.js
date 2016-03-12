import React, { PropTypes, } from 'react'
import SelectField from 'material-ui/lib/select-field'
import DropDownMenu from 'material-ui/lib/DropDownMenu'
import TextField from 'material-ui/lib/text-field'
import MenuItem from 'material-ui/lib/menus/menu-item'


import * as style from './style'

/** TODO filter, */
export default class JobHeader extends React.Component {
  static propTypes = {
    jobs: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  }

  render() {
    const { jobs, actions, } = this.props

    const totalJobCount = jobs.length
    const runningJobCount = jobs.filter(j => j.running).length

    return (
      <div>
        <div style={style.title}>
          Job
        </div>
        <div style={style.summary}>
          Running {runningJobCount} of {totalJobCount} Jobs
        </div>
        <div>

          <TextField
            hintText="Hint Text"
            floatingLabelText="Floating Label Text"
            />
          <SelectField value={1} className="right">
            <MenuItem value={1} primaryText="Never"/>
            <MenuItem value={2} primaryText="Every Night"/>
            <MenuItem value={3} primaryText="Weeknights"/>
            <MenuItem value={4} primaryText="Weekends"/>
            <MenuItem value={5} primaryText="Weekly"/>
          </SelectField>
        </div>
      </div>
    )
  }
}
