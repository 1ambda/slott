import fetch from 'isomorphic-fetch'
import { take, put, call, fork, select, } from 'redux-saga/effects'

import * as Converter from './converter'

/**
 * common APIs
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
 * exception will be caught in watcher functions
 */

export function* fetchJobs() {
  const url = '/api/jobs'

  return getJSON(url)
    .then(response => {
      if (!Array.isArray(response))
        throw new Error(`GET ${url} didn't return an array, got ${response}`)

      return response.map(Converter.convertServerJobToClientJob)
    })
}

export function* createJob(job) {
  const url = '/api/jobs'
  yield call(postJSON, url, Converter.removeClientProps(job)) /** return nothing */
}

export function* removeJob(id) {
  const url = `/api/jobs/${id}`
  yield call(deleteJSON, url) /** return nothing */
}

/**
 * Job has 2 sub-properties
 *
 * merged job can be accessed using `api/jobs/:id`
 *
 * 1. state: indicates whether job is running or not
 *
 *  `/api/jobs/:id/state`
 *
 *    { active: boolean }
 *
 *
 * 2. config:
 *
 *  `/api/jobs/:id/config`
 *
 *    {
 *      id: string,
 *      tags: Array<string>,
 *      enabled: boolean,
 *      ...
 *    }
 */

export function* fetchJobConfig(id) {
  const url = `/api/jobs/${id}/config`

  const serverJob = yield call(getJSON, url)

  /** remove state fields */
  return Converter.removeStateProps(serverJob)
}

export function* updateJobConfig(id, property) {
  const url = `/api/jobs/${id}/config`

  const serverJob = yield call(patchJSON, url, Converter.removeStateProps(property))
  const clientJob = Converter.convertServerJobToClientJob(serverJob)

  return clientJob
}

export function* setReadonly(id) {
  const updatedJob = yield call(updateJobConfig, id, Converter.createConfigToSetReadonly())
  return updatedJob
}

export function* unsetReadonly(id) {
  const updatedJob = yield call(updateJobConfig, id, Converter.createConfigToUnsetReadonly())
  return updatedJob
}

export function* updateJobState(id, state) {
  const url = `/api/jobs/${id}/state`
  yield call (patchJSON, url, state)
}

export function* startJob(id) {
  yield call(updateJobState, id, Converter.createStateToStartJob()) /** return nothing */
}

export function* stopJob(id) {
  yield call(updateJobState, id, Converter.createStateToStopJob()) /** return nothing */
}



