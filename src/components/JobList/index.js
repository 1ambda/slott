import React, { PropTypes, } from 'react'

import List from 'material-ui/lib/lists/list'
import Divider from 'material-ui/lib/divider'

import * as style from './style'
import JobItem from '../JobItem'

export default class JobList extends React.Component {
  static propTypes = {
    jobs: PropTypes.array.isRequired,
  }

  static createJobItem(job, index) {
    const { name, config, running, disabled, } = job
    return (<JobItem name={name}
                     config={config}
                     running={running}
                     key={index}
                     disabled={disabled}
                     index={index} />)
  }


  render() {

    const { jobs, } = this.props

    const jobItems = jobs
      .map((job, index) => { return { job, index, } })
      .reduce((acc, jobWithIndex) => {
        const { job, index, } = jobWithIndex
        acc.push(JobList.createJobItem(job, index))
        return acc
      }, [])

    return (
      <div>
        <List subheader="Jobs">
          <br/>
          <Divider />
          {jobItems}
        </List>
        <Divider />
      </div>
    )
  }
}
