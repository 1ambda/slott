import React, { PropTypes, } from 'react'

import NavBar from './NavBar'

class App extends React.Component {
  static propTypes = {
    children: PropTypes.element,
  }

  render() {
    return (
      <div>
        <NavBar />
        <br/>
        {this.props.children}
      </div>
    )
  }
}

export default App
