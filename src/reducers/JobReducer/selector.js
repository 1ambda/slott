import { JOB_STATE_PROPERTY, } from './index'


/** selectors used in saga handlers */
export function getJobItems(state) {
  return state.job[JOB_STATE_PROPERTY.JOB_ITEMS]
}

