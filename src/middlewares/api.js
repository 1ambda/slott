import fetch from 'isomorphic-fetch'

/**
 * common APIs
 *
 * return format: { response, error, }
 */

function handleResponse(url, method, promise) {
  return promise
    .then(response => {
      if (response.status !== 200) throw new Error(`${method} ${url}, status: ${response.status}`)
      else return response.json()
    })
    .then(response => {
      return { response, }
    })
    .catch(error => {
      console.error(error)
      return { error, }
    })
}

function getJSON(url) {
  return handleResponse(url, 'GET', fetch(url, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }))
}

function postJSON(url, body) {
  return handleResponse(url, 'POST', fetch(url, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }))
}

function putJSON(url, body) {
  return handleResponse(url, 'PUT', fetch(url, {
    method: 'put',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }))
}

function deleteJSON(url) {
  return handleResponse(url, 'DELETE', fetch(url, {
    method: 'delete',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }))
}


/** job related APIs */

export function delay(millis) {
  return new Promise(resolve => setTimeout(() => { resolve() }, millis))
}

export function* fetchJobs() {
  return getJSON('/api/jobs')
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
  return getJSON(`/api/jobs/${id}/config`)
    .then(({ response, }) => {
      return { response: removeIgnroedProps(response, IGNORED_CONFIG_PROPS), }
    })
}

export function* updateJobConfig(id, config) {
  return putJSON(`/api/jobs/${id}/config`, config)
    .then(({ response, }) => {
      return { response: removeIgnroedProps(response, IGNORED_CONFIG_PROPS), }
    })
}

export function* removeJob(id) {
  return deleteJSON(`/api/jobs/${id}`)
}

