import fs from 'fs-extra'
import colors from 'colors'

import { ENV_DEV, ENV_PROD, ENV_TEST, } from './env'

const DIR_CONFIG = 'config'
const FILE_PRODUCTION_JS = 'production.config.js'
const FILE_DEVELOPMENT_JS = 'development.config.js'
const PATH_PRODUCTION_CONFIG = `./${DIR_CONFIG}/${FILE_PRODUCTION_JS}`
const PATH_DEVELOPMENT_CONFIG = `./${DIR_CONFIG}/${FILE_DEVELOPMENT_JS}`
const FILE_PRODUCTION_SAMPLE_JS = 'production.sample.js'
const PATH_PRODUCTION_SAMPLE_CONFIG = `./${DIR_CONFIG}/${FILE_PRODUCTION_SAMPLE_JS}`

const env = process.env.NODE_ENV

try {
  fs.accessSync(PATH_PRODUCTION_CONFIG, fs.F_OK)
} catch (error) {
  console.log(`${PATH_PRODUCTION_CONFIG} doesn't exist, copying ${FILE_PRODUCTION_SAMPLE_JS}`.green) // eslint-disable-line no-console
  fs.copySync(PATH_PRODUCTION_SAMPLE_CONFIG, PATH_PRODUCTION_CONFIG)
}

/** require at runtime */
export const CONFIG =   (env === ENV_DEV) ?
  require(`../${DIR_CONFIG}/${FILE_DEVELOPMENT_JS}`) :
  require(`../${DIR_CONFIG}/${FILE_PRODUCTION_JS}`)

export const CONTAINERS = CONFIG.CONTAINERS
export const TITLE = CONFIG.TITLE

export const GLOBAL_VARIABLES = {
  'process.env.ENV_DEV': JSON.stringify(ENV_DEV),
  'process.env.ENV_PROD': JSON.stringify(ENV_PROD),
  'process.env.NODE_ENV': JSON.stringify(env),
  'process.env.CONTAINERS': JSON.stringify(CONTAINERS),
  'process.env.TITLE': JSON.stringify(TITLE),
}
