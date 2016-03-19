import fetch from 'isomorphic-fetch'

/**
 * return fetched JSON
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

export function delay(millis) {
  return new Promise(resolve => setTimeout(() => { resolve() }, millis))
}

