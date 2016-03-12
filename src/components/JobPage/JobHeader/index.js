import React, { PropTypes, } from 'react'

import Filter from '../../Common/Filter'
import Sorter from '../../Common/Sorter'
import * as style from './style'

import JobSortingStrategies from '../../../constants/JobSortStrategies'

/** TODO filter, */
export default class JobHeader extends React.Component {
  static propTypes = {
    sortingStrategy: PropTypes.string.isRequired,
    jobs: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  }

  handleFilterChange(filterKeyword) {
    const payload = { filterKeyword, }
    const { actions, } = this.props

    actions.filterJob(payload)
  }

  handleSorterChange(strategy) {
    const payload = { strategy, }
    const { actions, } = this.props

    actions.sortJob(payload)
  }

  createSummary(jobs) {
    const totalJobCount = jobs.length
    const runningJobCount = jobs.filter(j => j.running).length

    return (
      <div style={style.summary}>
        Running <span style={style.summaryRunningJob}>{runningJobCount}</span> of {totalJobCount} Jobs
      </div>
    )
  }

  render() {
    const { sortingStrategy, jobs, actions, } = this.props

    return (
      <div>
        <div style={style.title}>
          Job
        </div>
        <div>
          <Filter handler={this.handleFilterChange.bind(this)}
                  floatingLabel="Insert Filter"
                  style={style.filterInput} />
          <Sorter handler={this.handleSorterChange.bind(this)}
                  style={style.sorter}
                  labelStyle={style.sorterLabel}
                  floatingLabel="Sort by"
                  floatingLabelStyle={style.sorterFloatingLabel}
                  strategies={JobSortingStrategies}
                  currentStrategy={sortingStrategy} />
        </div>
        {this.createSummary(jobs)}
      </div>
    )
  }
}
