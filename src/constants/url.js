

/** injected by webpack, see also `tools/url.js` */
export const HOST_JOB_CONTAINER = process.env.CONTAINER_ADDRESS

export const URL_JOB_BASE = 'api/jobs'
export const URL_JOB_STATE_POSTFIX = 'state'
export const URL_JOB_CONFIG_POSTFIX = 'config'

export function buildJobStateUrl(id) {
  return `${HOST_JOB_CONTAINER}/${URL_JOB_BASE}/${id}/${URL_JOB_STATE_POSTFIX}`
}

export function buildJobConfigUrl(id) {
  return `${HOST_JOB_CONTAINER}/${URL_JOB_BASE}/${id}/${URL_JOB_CONFIG_POSTFIX}`
}

export function buildJobUrl(id) {
  let postfix = ''
  if (id !== void 0) postfix = `/${id}`

  return `${HOST_JOB_CONTAINER}/${URL_JOB_BASE}${postfix}`
}
