import React, { PropTypes, } from 'react'

import List from 'material-ui/lib/lists/list'
import Divider from 'material-ui/lib/divider'

import * as style from './style'
import JobItem from '../JobItem'

export default class JobList extends React.Component {
  static propTypes = {
    filterKeyword: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
  }

  static createJobItem(job, actions) {
    return (<JobItem {...job}
                     key={job.name}
                     actions={actions} />)
  }

  render() {
    const { jobs, filterKeyword, actions, } = this.props

    console.log(filterKeyword)

    const jobItems = jobs
      .reduce((acc, job) => {
        acc.push(JobList.createJobItem(job, actions))
        acc.push(<Divider key={`divider-${job.name}`} />)
        return acc
      }, [])

    return (
      <List style={style.list}>
        <Divider />
        {jobItems}
      </List>
    )
  }
}

