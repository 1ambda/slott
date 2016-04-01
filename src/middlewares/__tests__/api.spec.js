import { expect, } from 'chai'
import { fork, take, call, put, select, } from 'redux-saga/effects'

import * as JobActions from '../../actions/JobActions'
import * as JobApiActions from '../../actions/JobApiActions'
import * as JobActionTypes from '../../constants/JobActionTypes'
import * as JobApiActionTypes from '../../constants/JobApiActionTypes'
import * as Selector from '../../reducers/JobReducer/selector'

import * as API from '../api'

describe('api', () => {
  // TODO, how to test `getContainerJobConfigUrl`?
})
