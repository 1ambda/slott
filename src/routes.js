import React from 'react'
import { Route, IndexRoute, } from 'react-router'

import * as Page from './constants/Page'
import App from './components/Common/App'
import MainPage from './containers/MainPage'
import JobPage from './containers/JobPage'
import NotFoundPage from './components/Common/NotFoundPage'

export default (
  <Route path="/" component={App}>
    <IndexRoute component={JobPage} />
    <Route path={Page.JobPageRouting} component={JobPage}/>
    <Route path={Page.MainPageRouting} component={MainPage}/>
    <Route path="*" component={NotFoundPage} />
  </Route>
)
