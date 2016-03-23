import fetch from 'isomorphic-fetch'
import { take, put, call, fork, select, } from 'redux-saga/effects'

import * as Converter from './converter'

/**
 * common APIs
 *
 * return format: { response, }
 *
 * doesn't handle exceptions
 */

const HTTP_METHOD = {
  GET: 'GET',       /** get */
  POST: 'POST',     /** create */
  PATCH: 'PATCH',   /** partial update */
  PUT: 'PUT',       /** replace */
  DELETE: 'DELETE', /** remove */
}

const HTTP_HEADERS_JSON = {
  'Accept': 'application/json',
  'Content-Type': 'application/json',
}

function handleJsonResponse(url, method, promise) {
  return promise
    .then(response => {
      if ((method === HTTP_METHOD.POST && response.status !== 201) /** if post, status should === 201 */
        || (method !== HTTP_METHOD.POST && response.status !== 200)) /** otherwise, status === 200 */
        throw new Error(`${method} ${url}, status: ${response.status}`)
      else return response.json()
    })
    .then(response => { return { response, } })
}

function getJSON(url) {
  const method = HTTP_METHOD.GET

  return handleJsonResponse(url, method, fetch(url, {
    method,
    headers: HTTP_HEADERS_JSON,
  }))
}

function postJSON(url, body) {
  const method = HTTP_METHOD.POST

  return handleJsonResponse(url, method, fetch(url, {
    method,
    headers: HTTP_HEADERS_JSON,
    body: JSON.stringify(body),
  }))
}

function patchJSON(url, body) {
  const method = HTTP_METHOD.PATCH

  return handleJsonResponse(url, method, fetch(url, {
    method,
    headers: HTTP_HEADERS_JSON,
    body: JSON.stringify(body),
  }))
}

function putJSON(url, body) {
  const method = HTTP_METHOD.PUT

  return handleJsonResponse(url, method, fetch(url, {
    method,
    headers: HTTP_HEADERS_JSON,
    body: JSON.stringify(body),
  }))
}

function deleteJSON(url) {
  const method = HTTP_METHOD.DELETE

  return handleJsonResponse(url, method, fetch(url, {
    method,
    headers: HTTP_HEADERS_JSON,
  }))
}


/** job related functions */

export function delay(millis) {
  return new Promise(resolve => setTimeout(() => { resolve() }, millis))
}

/**
 * high level API (business related)
 *
 * return format: { response, error, }
 *
 * should handle exceptions
 */

export function handleError(error) { console.error(error); return { error, } }

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
      return { response: Converter.removeServerSpecificProps(response), }
    })
    .catch(handleError)
}

export function* updateJobConfig(id, config) {
  return patchJSON(`/api/jobs/${id}`, Converter.refineClientPropsToUpdate(config))
    .then(({ response, }) => { /** return job, instead of config, will be fixed (TODO) */
      return { response: Converter.convertServerJobToClientJob(response), }
    })
    .catch(handleError)
}

export function* setReadonly(id) {
  const { response, error, } = yield call(updateJobConfig, id, Converter.createPropToSetReadonly())
  return { response, error, }
}

export function* unsetReadonly(id) {
  const { response, error, } = yield call(updateJobConfig, id, Converter.createPropToUnsetReadonly())
  return { response, error, }
}

export function* createJob(config) {
  return postJSON('/api/jobs', Converter.refineClientPropsToCreate(config))
    .catch(handleError) /** ignore response, we will fetch all jobs again in watcher */
}

export function* removeJob(id) {
  return deleteJSON(`/api/jobs/${id}`)
    .catch(handleError) /** ignore response, we will fetch all jobs again in watcher */
}


