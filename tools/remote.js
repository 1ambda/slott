import fs from 'fs-extra'

/** initialize resource/db.json */

const resourceDir = 'resource'

const remotes = ['remote1', 'remote2', 'remote3',]

remotes.map(remote => {
  fs.copySync(`${resourceDir}/${remote}/db.origin.json`, `${resourceDir}/${remote}/db.json`)
})

