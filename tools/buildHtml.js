import fs from 'fs'
import colors from 'colors'
import cheerio from 'cheerio'

const useTrackJs = true
const trackJsToken = ''

fs.readFile('src/index.html', 'utf8', (err, markup) => {
  if (err) return console.log(err)

  const $ = cheerio.load(markup)

  $('head').prepend('<link rel="stylesheet" href="styles.css">')

  if (useTrackJs) {
    if (trackJsToken) {
      const trackJsCode = `<!-- BEGIN TRACKJS Note: This should be the first <script> on the page per https://my.trackjs.com/install --><script>window._trackJs = { token: '${trackJsToken}' }</script><script src=https://d2zah9y47r7bi2.cloudfront.net/releases/current/tracker.js></script><!-- END TRACKJS -->`
      $('head').prepend(trackJsCode)
    } else {
      console.log('To track JavaScript errors, sign up for a free trial at TrackJS.com and enter your token in /tools/build.html on line 10.'.yellow)
    }
  }

  fs.writeFile('dist/index.html', $.html(), 'utf8', function (err) {
    if (err) return console.log(err)
  })

  console.log('index.html written to /dist'.green)
})

