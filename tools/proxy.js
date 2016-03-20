import proxyMiddleware from 'http-proxy-middleware'

const options = {
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true,
  proxyTable: { 'localhost:3000' : 'http://localhost:3002', },
}

export default proxyMiddleware('/api', options)
