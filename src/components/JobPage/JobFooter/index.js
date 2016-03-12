import React, { PropTypes, } from 'react'

/** TODO stop all button, */
export default class JobFooter extends React.Component {
  static propTypes = {
    jobs: PropTypes.array.isRequired,
    actions: PropTypes.object.isRequired,
  }

  render() {
    return (
      <div>
        JobFooter
      </div>
    )
  }
}
