import fs from 'fs-extra'

/** initialize resource/db.json */

const resourceDir = 'resource'

fs.copySync(`${resourceDir}/db.origin.json`, `${resourceDir}/db.json`)
