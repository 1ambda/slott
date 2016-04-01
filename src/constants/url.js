/** injected by webpack, see also `tools/url.js` */
export const HOST_JOB_CONTAINER = process.env.CONTAINER_ADDRESS

export const URL_JOB_BASE = 'api/jobs'
export const URL_JOB_PROPERTY_STATE = 'state'
export const URL_JOB_PROPERTY_CONFIG = 'config'

export const CONTAINER_PROPERTY = {
  name: 'name',
  address: 'address',
}

/** multi container support */
export const CONTAINERS = process.env.CONTAINERS || []
export const CONTAINER_NAMES = CONTAINERS.map(container => container[CONTAINER_PROPERTY.name])
export const INITIAL_CONTAINER_NAME = CONTAINER_NAMES[0]

/** internal functions (tested) */

export function _getContainerAddress(containers, name) {
  const filtered = containers.filter(container => container[CONTAINER_PROPERTY.name] === name)

  if (filtered.length >= 2) throw new Error(`CONTAINERS has duplicated ${name}`)
  if (filtered.length === 0) throw new Error(`Can't find address using container name: ${name}`)

  return filtered[0].address
}

export function _buildContainerJobPropertyUrl(containers, containerName, id, property) {
  if (id === void 0 || id === null || id === '')
    throw new Error(`Can't get container job url. id is ${id}`)

  if (property === void 0 || property === null || property === '')
    throw new Error(`Can't get container job url. property is ${property}`)

  if (containerName === void 0 || containerName === null || containerName === '')
    throw new Error(`Can't get container job ${property} url. container' is ${containerName}`)

  const containerAddress = _getContainerAddress(containers, containerName)

  if (containerAddress === void 0 || containerAddress === null || containerAddress === '')
    throw new Error(`Can\'t get container address, CONTAINER_NAME_TO_ADDRESS[${containerName}] is undefined`)

  return `${containerAddress}/${URL_JOB_BASE}/${id}/${property}`
}

export function buildContainerJobPropertyUrl(containerName, id, property) {
  return _buildContainerJobPropertyUrl(CONTAINERS, containerName, id, property)
}

export function _buildContainerJobUrl(containers, containerName, id) {

  const prefix = (id === void 0) ? '' : `/${id}`

  const containerAddress = _getContainerAddress(containers, containerName)

  return `${containerAddress}/${URL_JOB_BASE}${prefix}`
}

/** exposed functions, use ENV variables (injected by webpack) */

export default {
  getContainerJobStateUrl: (containerName, id) => {
    return buildContainerJobPropertyUrl(containerName, id, URL_JOB_PROPERTY_STATE)
  },

  getContainerJobConfigUrl: (containerName, id) => {
    return buildContainerJobPropertyUrl(containerName, id, URL_JOB_PROPERTY_CONFIG)
  },

  getContainerJobUrl: (containerName, id) => { /** id might be undefined */
    return _buildContainerJobUrl(CONTAINERS, containerName, id)
  },
}



