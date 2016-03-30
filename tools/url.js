import { ENV_DEV, } from './env'

const envAddress = process.env.CONTAINER_ADDRESS
const DEVELOPMENT_CONTAINER_ADDRESS = 'http://localhost:3002' /** json mock-server, see package.json */
const PRODUCTION_CONTAINER_ADDRESS = 'http://localhost:8080'

let containerAddress = (process.env.NODE_ENV === ENV_DEV) ? DEVELOPMENT_CONTAINER_ADDRESS :
  (envAddress === void 0) ? PRODUCTION_CONTAINER_ADDRESS :
    envAddress /** used with `npm run start:client-cors` */

export const CONTAINER_ADDRESS = containerAddress

