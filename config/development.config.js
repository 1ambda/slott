export const defaultContainers = [
  { name: 'akka', address: 'http://localhost:3002', },
  { name: 'real-time', address: 'http://localhost:3003', },
  { name: 'batch', address: 'http://localhost:3004', },
]

/** exposed variables, should be stringified if it is string */
export const CONTAINERS = JSON.stringify(defaultContainers)
export const TITLE = JSON.stringify('Slott')
export const PAGINATOR_ITEM_COUNT = 5
