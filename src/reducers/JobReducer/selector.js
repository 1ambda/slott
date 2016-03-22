import { JOB_STATE_PROPERTY, } from './index'

export function getJobItems(state) {
  return state.job[JOB_STATE_PROPERTY.JOB_ITEMS]
}

