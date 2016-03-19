import browserSync from 'browser-sync'
import historyApiFallback from 'connect-history-api-fallback'
import proxyMiddleware from './proxy'

browserSync.init({
  port: 3000,
  ui: { port: 3001, },
  server: {
    baseDir: ['dist',],
  },

  files: [ 'src/*.html', ],

  middleware: [
    proxyMiddleware,
    historyApiFallback(),
  ],
})
