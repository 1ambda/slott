import { INITIAL_JOB_STATE, JOB_PROPERTY, JOB_STATE, } from '../reducers/JobReducer/job'

export const SERVER_JOB_PROPERTY = {
  active: 'active',
  enabled: 'enabled',
}

export const IGNORED_SERVER_JOB_PROPS = [
  SERVER_JOB_PROPERTY.enabled,
  SERVER_JOB_PROPERTY.active,
]

export const IGNORED_CLIENT_JOB_PROPS = [
  JOB_PROPERTY.switching,
  JOB_PROPERTY.state,
]

/**
 * @param props Object
 * @param propsToIgnore Array of String
 */
export function removeProps(props, propsToIgnore) {
  /** copy before removing properties */
  const copied = Object.assign({}, props)

  return propsToIgnore.reduce((acc, ignoredProp) => {
    delete acc[ignoredProp]
    return acc
  }, copied)
}

export function removeServerSpecificProps(props) {
  return removeProps(props, IGNORED_SERVER_JOB_PROPS)
}


/**
 * jobs returned from server contains
 *
 * - `active`, indicates job is running
 * - `enabled`, indicates job is enabled (= not readonly)
 * - `_id`, indicates mongodb id
 */

export function interpretServerJobState(serverJob) {
  let { active, enabled, } = serverJob

  if (enabled === void 0) {
    /*eslint-disable no-console */
    console.error(`${serverJob[JOB_PROPERTY.id]} has no '${SERVER_JOB_PROPERTY.enabled}' prop`)
    /*eslint-enable no-console */
    enabled = false
  }

  if (active === void 0) {
    /*eslint-disable no-console */
    console.error(`${serverJob[JOB_PROPERTY.id]} has no '${SERVER_JOB_PROPERTY.active}' prop`)
    /*eslint-enable no-console */
    active = false
  }

  if (active) return JOB_STATE.RUNNING
  else if (!active && enabled) return JOB_STATE.WAITING
  else if (!active && !enabled) return JOB_STATE.STOPPED
  else throw new Error(`Invalid server job: ${JSON.stringify(serverJob)}`)
}

/** responsible for converting server jobs to client jobs, used to fetch all jobs */
export function convertServerJobToClientJob (job) {
  const state = interpretServerJobState(job)
  const filtered = removeServerSpecificProps(job)

  return Object.assign({}, INITIAL_JOB_STATE, {
    [JOB_PROPERTY.id]: job[JOB_PROPERTY.id],
    [JOB_PROPERTY.tags]: job[JOB_PROPERTY.tags],
    [JOB_PROPERTY.state]: state,
    ...filtered,
  })
}

export function createEnabledConfig(readonly) { return { [SERVER_JOB_PROPERTY.enabled]: !readonly, } }
export function createConfigToSetReadonly() { return createEnabledConfig(true) }
export function createConfigToUnsetReadonly() { return createEnabledConfig(false) }

export function createActiveState(active) { return { [SERVER_JOB_PROPERTY.active]: active, } }
export function createStateToStartJob() { return createActiveState(true) }
export function createStateToStopJob() { return createActiveState(false) }

export function removeClientProps(props) {
  return removeProps(props, IGNORED_CLIENT_JOB_PROPS)
}

export function removeStateProps(props) {
  return removeProps(props, [SERVER_JOB_PROPERTY.active, ])
}

