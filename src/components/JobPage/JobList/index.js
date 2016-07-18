import React, { PropTypes, } from 'react'

import { List, ListItem, } from 'material-ui/List'
import Divider from 'material-ui/Divider'

import * as style from './style'
import JobItem from '../JobItem'

export default class JobList extends React.Component {
  static propTypes = {
    filterKeyword: PropTypes.string.isRequired,
    actions: PropTypes.object.isRequired,
    jobs: PropTypes.array.isRequired,
  }

  static createJobItem(job, actions) {
    return (<JobItem job={job} key={job.id} actions={actions} />)
  }

  render() {
    const { jobs, actions, } = this.props

    const jobItems = jobs
      .reduce((acc, job) => {
        acc.push(JobList.createJobItem(job, actions))
        acc.push(<Divider key={`divider-${job.id}`} />)
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

