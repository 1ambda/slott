import { ENV_DEV, } from './env'

import { CONTAINER_PROPERTY, } from '../src/middlewares/url'

/** json mock-server, see package.json */
export const DEVELOPMENT_CONTAINERS = [
  { [CONTAINER_PROPERTY.name]: 'akka', [CONTAINER_PROPERTY.address]: 'http://localhost:3002', },
  { [CONTAINER_PROPERTY.name]: 'real-time', [CONTAINER_PROPERTY.address]: 'http://localhost:3003', },
  { [CONTAINER_PROPERTY.name]: 'batch', [CONTAINER_PROPERTY.address]: 'http://localhost:3004', },
]

export const PRODUCTION_CONTAINERS = process.env.CONTAINERS || [
  { name: 'local-01', address: 'http://localhost:8080', },
]

export const CONTAINERS = (process.env.NODE_ENV === ENV_DEV) ?
  DEVELOPMENT_CONTAINERS : PRODUCTION_CONTAINERS



