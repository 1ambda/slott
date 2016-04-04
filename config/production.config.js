const envContainers = process.env.SLOTT_CONTAINERS
export const defaultContainers = [
    { name: 'local', address: 'http://localhost:8081', },
  ]
export const title = process.env.SLOTT_TITLE || 'Slott'
const envPaginatorItemCount = process.env.SLOTT_PAGINATOR_ITEM_COUNT

/** exposed variables, should be stringified if it is string */
export const CONTAINERS = (envContainers === void 0) ?
  JSON.stringify(defaultContainers) : envContainers /** envContainer is already stringified */

export const TITLE = JSON.stringify(title)
export const PAGINATOR_ITEM_COUNT = (envPaginatorItemCount === void 0) ?
    10 : parseInt(envPaginatorItemCount)
