const path = require('path')
const webpack = require('webpack')

const builds = {
  // ES6 Module
  // UglifyJs 不支持 Harmony模式的压缩
  // 详见: https://github.com/mishoo/UglifyJS2/issues/448
  'harmony': {
    filename: 'bundle.harmony.js'
  },
  // 验证 tree-shaking 都是因为 ES6 modules 的静态特性才得以实现的
  // 详见: https://www.zhihu.com/question/41922432/answer/93346223
  'common': {
    entry: path.resolve(__dirname, '../src/entry.common.js'),
    filename: 'bundle.common.js'
  },
  // 正常使用 babel es2015 预设
  // 预设里包含 babel-plugin-transform-es2015-modules-commonjs 编译模块
  // 详见：http://www.2ality.com/2015/12/webpack-tree-shaking.html
  'babel': {
    filename: 'bundle.normal.js',
    babel: true,
    query: {
      presets: ['es2015']
    }
  },
  /**
   * 无 commonjs 模块示例
   * ↓↓↓↓ 见下方
   */
  // babel ES6 Module to es5
  'without-optimize': {
    filename: 'bundle.without-optimize.js',
    babel: true
  },
  // babel ES6 Module to es5
  'with-optimize': {
    filename: 'bundle.with-optimize.js',
    babel: true,
    optimize: true
  }
}

function genConfig (opts) {
  let config = {
    entry: opts.entry || path.resolve(__dirname, '../src/entry.js'),
    output: {
      path: path.resolve(__dirname, '../dist'),
      filename: opts.filename
    }
  }

  if (opts.babel) {
    config.module = {
      rules: [
        {
          test: /.js$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    }

    // 自定义预设
    if (opts.query) {
      config.module.rules[0].query = opts.query
    }
  }
  if (opts.optimize) {
    config.plugins = [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  }

  return config
}

exports.getAllBuilds = () => Object.keys(builds).map(name => genConfig(builds[name]))
