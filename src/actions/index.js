
import * as JobActions from './JobActions'
import * as JobApiActions from './JobApiActions'

export const ACTION_CONTAINER = {
  job: 'job',
}

export default {
  [ACTION_CONTAINER.job]: Object.assign({}, JobActions, JobApiActions),
}

