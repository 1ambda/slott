import { ENV_DEV, } from './env'

const DEVELOPMENT_CONTAINER_ADDRESS = 'http://localhost:3002' /** json mock-server, see package.json */
const PRODUCTION_CONTAINER_ADDRESS = 'http://localhost:8080'

let containerAddress = (process.env.NODE_ENV === ENV_DEV) ?
  DEVELOPMENT_CONTAINER_ADDRESS : PRODUCTION_CONTAINER_ADDRESS

export const CONTAINER_ADDRESS = containerAddress

