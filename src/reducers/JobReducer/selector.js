import { JOB_STATE_PROPERTY, } from './index'


/** selectors used in saga handlers */
export function getJobItems(state) {
  return state.job[JOB_STATE_PROPERTY.JOB_ITEMS]
}

export function getSelectedContainer(state) {
  return state.job[JOB_STATE_PROPERTY.CONTAINER_SELECTOR].selectedContainer
}

export function getCurrentSortStrategy(state) {
  return state.job[JOB_STATE_PROPERTY.SORTER].selectedStrategy
}

