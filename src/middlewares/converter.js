import { INITIAL_JOB_STATE, JOB_PROPERTY, JOB_STATE, } from '../reducers/JobReducer/job'

export const SERVER_JOB_PROPERTY = {
  _id: '_id',
  enabled: 'enabled',
  active: 'active',
}

export const IGNORED_SERVER_PROPS = [
  SERVER_JOB_PROPERTY._id,
  SERVER_JOB_PROPERTY.enabled,
  SERVER_JOB_PROPERTY.active,
]

export const IGNORED_CLIENT_PROPS = [
  JOB_PROPERTY.switching,
  JOB_PROPERTY.state,
]

/**
 * jobs returned from server contains
 *
 * - `active`, indicates job is running
 * - `enabled`, indicates job is enabled (= not readonly)
 * - `_id`, indicates mongodb id
 */

export function interpretServerJobState(serverJob) {
  const { active, enabled, } = serverJob
  if (active === void 0 || enabled === void 0) /** if one of prop is undefined */
    throw new Error(`Fetched job ${serverJob[JOB_PROPERTY.id]} has no ${SERVER_JOB_PROPERTY.enabled} property`)

  if (active && !enabled) return JOB_STATE.RUNNING
  else if (!active && enabled) return JOB_STATE.WAITING
  else if (!active && !enabled) return JOB_STATE.STOPPED
  else throw new Error(`Invalid server job: ${JSON.stringify(serverJob)}`)
}

export function interpretClientJobState(clientJob) {
  const { state, } = clientJob

  if (state === void 0)
    throw new Error(`client job state is void, ${JSON.stringify(clientJob)}`)

  if (JOB_STATE.RUNNING === state) return { active: true, enabled: true, }
  else if (JOB_STATE.WAITING === state) return { active: false, enabled: true, }
  else if (JOB_STATE.STOPPED === state) return { active: false, enabled: false, }
  else throw new Error(`Can't interpret invalid client job state, ${JSON.stringify(clientJob)}`)
}

/** responsible for converting server jobs to client jobs, used to fetch all jobs */
export function convertServerJobToClientJob (job) {

  /** copy before removing properties */
  const config = removeServerSpecificProps(Object.assign({}, job))

  return Object.assign({}, INITIAL_JOB_STATE, {
    [JOB_PROPERTY.id]: job[JOB_PROPERTY.id],
    [JOB_PROPERTY.tags]: job[JOB_PROPERTY.tags],
    [JOB_PROPERTY.config]: config,
    [JOB_PROPERTY.state]: interpretServerJobState(job),
  })
}

/** remove server specific config props, used to */
export function removeServerSpecificConfigProps(config) {
  const filtered = removeServerSpecificProps(Object.assign({}, config))
  return Object.assign({}, filtered)
}

export function refineClientConfigPropsToCreate(config) {
  const filtered = removeServerSpecificProps(Object.assign({}, config))
  return Object.assign({}, filtered, {
    [SERVER_JOB_PROPERTY.enabled]: true,
    [SERVER_JOB_PROPERTY.active]: false, // TODO remove
  })
}

export function removeIgnored(job, propsToIgnore) {
  return propsToIgnore.reduce((acc, ignoredProp) => {
    delete acc[ignoredProp]
    return acc
  }, job)
}

export function removeServerSpecificProps(job) {
  return removeIgnored(job, IGNORED_SERVER_PROPS)
}

export function removeClientSpecificProps(job) {
  return removeIgnored(job, IGNORED_CLIENT_PROPS)
}

