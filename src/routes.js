import React from 'react'
import { Route, IndexRoute, } from 'react-router'

import App from './components/Common/App'
import MainPage from './containers/MainPage'
import JobPage from './containers/JobPage'
import NotFoundPage from './components/Common/NotFoundPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={MainPage} />
    <Route path="job" component={JobPage}/>
    <Route path="*" component={NotFoundPage} />
  </Route>
)
