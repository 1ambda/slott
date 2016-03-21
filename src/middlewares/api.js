import fetch from 'isomorphic-fetch'

/**
 * fetch JSON
 *
 * return format is { response, error, }
 */
function fetchJSON(url) {
  return fetch(url)
    .then(response => {
      if (response.status !== 200) throw new Error(`Failed to fetch ${url} (${response.status})`)
      else return response.json()
    })
    .then(response => {
      return { response, }
    })
    .catch(error => {
      return { error, }
    })
}

export function* fetchJobs() {
  return fetchJSON('/api/jobs')
}

export const IGNORED_CONFIG_PROPS = [
  '_id', 'enabled',
]

export function removeIgnroedProps(config, propsToIgnore) {
  return propsToIgnore.reduce((acc, ignoredProp) => {
    delete acc[ignoredProp]
    return acc
  }, config)
}

export function* fetchJobConfig(id) {
  return fetchJSON(`/api/jobs/${id}`)
    .then(({ response, }) => {
      return { response: removeIgnroedProps(response.config, IGNORED_CONFIG_PROPS), }
    })
}

export function delay(millis) {
  return new Promise(resolve => setTimeout(() => { resolve() }, millis))
}

