const envAddress = process.env.CONTAINER_ADDRESS

const containerAddress = (envAddress === void 0) ?
  'http://localhost:3002' : envAddress

export const CONTAINER_ADDRESS = containerAddress
export const isCORS = (envAddress === void 0)


