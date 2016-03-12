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

  static createJobItem(job, index, actions) {
    return (<JobItem {...job}
                     key={index}
                     actions={actions} />)
  }

  render() {
    const { jobs, filterKeyword, actions, } = this.props

    console.log(filterKeyword)

    const jobItems = jobs
      .map((job, index) => { return { job, index, } })
      .reduce((acc, jobWithIndex) => {
        const { job, index, } = jobWithIndex
        acc.push(JobList.createJobItem(job, index, actions))
        acc.push(<Divider key={`divider-${index}`} />)
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

