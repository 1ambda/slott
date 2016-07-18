import { JOB_STATE_PROPERTY, } from './index'


/** selectors used in saga handlers */
export function jobItems(state) {
  return state.job[JOB_STATE_PROPERTY.JOB_ITEMS]
}

export function selectedContainer(state) {
  return state.job[JOB_STATE_PROPERTY.CONTAINER_SELECTOR].selectedContainer
}

export function currentSortStrategy(state) {
  return state.job[JOB_STATE_PROPERTY.SORTER].selectedStrategy
}

