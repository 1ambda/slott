import webpack from 'webpack'
import path from 'path'
import ExtractTextPlugin from 'extract-text-webpack-plugin'

const developmentEnvironment = 'development'
const productionEnvironment = 'production'
const testEnvironment = 'test'

const getPlugins = function (env) {
  const GLOBALS = {
    'process.env.NODE_ENV': JSON.stringify(env),
    __DEV__: env === developmentEnvironment,
  }

  const plugins = [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin(GLOBALS),
  ]

  switch (env) {
    case productionEnvironment:
      plugins.push(new ExtractTextPlugin('styles.css'))
      plugins.push(new webpack.optimize.DedupePlugin())
      plugins.push(new webpack.optimize.UglifyJsPlugin())
      break

    case developmentEnvironment:
      plugins.push(new webpack.HotModuleReplacementPlugin())
      plugins.push(new webpack.NoErrorsPlugin())
      break
  }

  return plugins
}

const getEntry = function (env) {
  const entry = []

  if (env === developmentEnvironment ) entry.push('webpack-hot-middleware/client')

  entry.push('./src/index')

  return entry
}

const getPostcssPlugins = function (env) {

  let browsers = ['last 10 version', '> 5%', 'ie >= 8']

  let plugins = [
    require('postcss-url')({
      copy: 'rebase',
    }),
    require('postcss-cssnext')({
      browsers: browsers,
    }),
    require('postcss-reporter')({
      clearMessages: true,
    }),
    require('autoprefixer')({
      browsers: browsers,
    }),
    require('postcss-import')(),
  ]

  return plugins;
}


const getLoaders = function (env) {
  const loaders = [
    {
      test: /\.js$/,
      include: path.join(__dirname, 'src'),
      loaders: ['babel', 'eslint',],
    },
    { /** globally used css */
      test: /(\.css)$/,
      include: [ path.join(__dirname, 'node_modules') ],
      loaders: ['style', 'css?sourceMap&importLoaders=1', 'postcss']
    },
    {
      test: /\.woff(\?\S*)?$/,
      loader: 'url-loader?limit=10000&minetype=application/font-woff'
    },
    {
      test: /\.woff2(\?\S*)?$/,
      loader: 'url-loader?limit=10000&minetype=application/font-woff'
    },
    {
      test: /\.eot(\?\S*)?$/,
      loader: 'url-loader'
    }, {
      test: /\.ttf(\?\S*)?$/,
      loader: 'url-loader'
    },
    {
      test: /\.svg(\?\S*)?$/,
      loader: 'url-loader'
    },
  ]

  if (env === productionEnvironment ) {
    loaders.push({
        test: /(\.css)$/,
        include: path.join(__dirname, 'src'),
        loader: ExtractTextPlugin.extract(['style', 'css?sourceMap&module&importLoaders=1', 'postcss']),
      }
    )
  } else {
    loaders.push({
        test: /(\.css)$/,
        include: path.join(__dirname, 'src'),
        loaders: ['style', 'css?sourceMap&module&importLoaders=1', 'postcss']
      }
    )
  }

  return loaders
}

function getConfig(env) {
  return {
    debug: true,
    devtool: env === productionEnvironment  ? 'source-map' : 'cheap-module-eval-source-map', // more info:https://webpack.github.io/docs/build-performance.html#sourcemaps and https://webpack.github.io/docs/configuration.html#devtool
    noInfo: true,
    entry: getEntry(env),
    target: env === testEnvironment ? 'node' : 'web',
    output: {
      path: __dirname + '/dist',
      publicPath: '',
      filename: 'bundle.js',
    },
    //externals: {
    //  jsoneditor: 'JSONEditor',
    //},
    plugins: getPlugins(env),
    module: { loaders: getLoaders(env), },
    postcss: getPostcssPlugins(),
  }
}

export default getConfig
