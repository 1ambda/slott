import { ENV_DEV, } from './env'

import { CONTAINER_PROPERTY, } from '../src/constants/url'

/** json mock-server, see package.json */
export const DEVELOPMENT_CONTAINER_ADDRESS = 'http://localhost:3002'
export const PRODUCTION_CONTAINER_ADDRESS = 'http://localhost:8080'

/** json mock-server, see package.json */
export const DEVELOPMENT_CONTAINERS = [
  { [CONTAINER_PROPERTY.name]: 'local-01', [CONTAINER_PROPERTY.address]: 'http://localhost:3002', },
  { [CONTAINER_PROPERTY.name]: 'local-02', [CONTAINER_PROPERTY.address]: 'http://localhost:3003', },
  { [CONTAINER_PROPERTY.name]: 'local-03', [CONTAINER_PROPERTY.address]: 'http://localhost:3004', },
]

export const PRODUCTION_CONTAINERS = process.env.CONTAINERS || [
  { name: 'local-01', address: 'http://localhost:8080', },
]

export const CONTAINER_ADDRESS = (process.env.NODE_ENV === ENV_DEV) ?
  DEVELOPMENT_CONTAINER_ADDRESS : PRODUCTION_CONTAINER_ADDRESS

export const CONTAINERS = (process.env.NODE_ENV === ENV_DEV) ?
  DEVELOPMENT_CONTAINERS : PRODUCTION_CONTAINERS



