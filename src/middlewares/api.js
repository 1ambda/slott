import fetch from 'isomorphic-fetch'
import * as Converter from './converter'

/**
 * common APIs
 *
 * return format: { response, }
 *
 * doesn't handle exceptions
 */

function handleJsonResponse(url, method, promise) {
  return promise
    .then(response => {
      if (response.status !== 200) throw new Error(`${method} ${url}, status: ${response.status}`)
      else return response.json()
    })
    .then(response => { return { response, } })
}

function getJSON(url) {
  const method = 'GET'

  return handleJsonResponse(url, method, fetch(url, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }))
}

function postJSON(url, body) {
  const method = 'POST'

  return handleJsonResponse(url, method, fetch(url, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }))
}

function patchJSON(url, body) {
  const method = 'PATCH'

  return handleJsonResponse(url, method, fetch(url, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }))
}

function putJSON(url, body) {
  const method = 'PUT'

  return handleJsonResponse(url, method, fetch(url, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }))
}

function deleteJSON(url) {
  const method = 'DELETE'

  return handleJsonResponse(url, 'DELETE', fetch(url, {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  }))
}


/** job related functions */

export function delay(millis) {
  return new Promise(resolve => setTimeout(() => { resolve() }, millis))
}

export function handleError(error) { console.error(error); return { error, } }

/**
 * high level API
 *
 * should handle exceptions
 */
export function* fetchJobs() {
  const url = '/api/jobs'

  return getJSON(url)
    .then(({ response, }) => {
      if (!Array.isArray(response))
        throw new Error(`GET ${url} didn't return an array, got ${response}`)

      return { response: response.map(Converter.convertServerJobToClientJob), }
    })
    .catch(handleError)
}

export function* fetchJobConfig(id) {
  return getJSON(`/api/jobs/${id}`)
    .then(({ response, }) => {
      return { response: Converter.convertServerJobConfigToClientJobConfig(response), }
    })
    .catch(handleError)
}

export function* updateJobConfig(id, config) {
  return patchJSON(`/api/jobs/${id}`, Converter.convertServerJobConfigToClientJobConfig(config))
    .then(({ response, }) => {
      return { response: {}, /** ignore, we will fetch all jobs again */ }
    })
    .catch(handleError)
}

export function* removeJob(id) {
  return deleteJSON(`/api/jobs/${id}`)
    .catch(handleError)
}

