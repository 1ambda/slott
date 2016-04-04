/** injected by webpack, see also `tools/config.js` */

export const ENV_DEV = process.env.ENV_DEV || ''
export const ENV_PROD = process.env.ENV_PROD || ''
export const NODE_ENV = process.env.NODE_ENV || ''
export const CONTAINERS = process.env.CONTAINERS || []
export const TITLE = process.env.TITLE || ''
export const PAGINATOR_ITEM_COUNT_PER_PAGE =
  (process.env.PAGINATOR_ITEM_COUNT_PER_PAGE === void 0) ?
    6 : process.env.PAGINATOR_ITEM_COUNT_PER_PAGE
