import fs from 'fs-extra'
import colors from 'colors'

import { ENV_DEV, } from './env'

const DIR_CONFIG = 'config'
const FILE_PRODUCTION_JS = 'production.js'
const FILE_DEVELOPMENT_JS = 'development.js'
const PATH_PRODUCTION_CONFIG = `./${DIR_CONFIG}/${FILE_PRODUCTION_JS}`
const PATH_DEVELOPMENT_CONFIG = `./${DIR_CONFIG}/${FILE_DEVELOPMENT_JS}`
const FILE_PRODUCTION_SAMPLE_JS = 'production.sample.js'
const PATH_PRODUCTION_SAMPLE_CONFIG = `./${DIR_CONFIG}/${FILE_PRODUCTION_SAMPLE_JS}`

try {
  fs.accessSync(PATH_PRODUCTION_CONFIG, fs.F_OK);
} catch (error) {
  console.log(`${PATH_PRODUCTION_CONFIG} doesn't exist, copying ${FILE_PRODUCTION_SAMPLE_JS}`.green)
  fs.copySync(PATH_PRODUCTION_SAMPLE_CONFIG, PATH_PRODUCTION_CONFIG)
}

/** require at runtime */
const ProductionConfig = require(`../${DIR_CONFIG}/${FILE_PRODUCTION_JS}`)
const DevelopmentConfig = require(`../${DIR_CONFIG}/${FILE_DEVELOPMENT_JS}`)

/** json mock-server, see package.json */
export const CONTAINERS = (process.env.NODE_ENV === ENV_DEV) ?
  DevelopmentConfig.CONTAINERS : ProductionConfig.CONTAINERS



