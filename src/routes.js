import React from 'react'
import { Route, IndexRoute, } from 'react-router'

import App from './components/App'
import MainPage from './containers/MainPage'
import JobPage from './containers/JobPage'
import HistoryPage from './components/HistoryPage'
import NotFoundPage from './components/NotFoundPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={MainPage} />
    <Route path="job" component={JobPage}/>
    <Route path="history" component={HistoryPage}/>
    <Route path="*" component={NotFoundPage} />
  </Route>
)
