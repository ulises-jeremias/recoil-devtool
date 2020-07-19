const webpack = require('webpack');
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssWebpackPlugin = require('mini-css-extract-plugin')
const AsyncChunkNames = require('webpack-async-chunk-names-plugin')
const ManifestPlugin = require('webpack-manifest-plugin');

const commonPaths = require('./common-paths');

const config = {
  context: commonPaths.context,
  entry: [
    'babel-polyfill',
    ...commonPaths.entryPoints,
  ],
  output: {
    filename: 'static/js/[name].[hash:8].bundle.js',
    path: commonPaths.outputPath,
    publicPath: '/',
  },
  module: {
    rules: [{
      enforce: 'pre',
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'eslint-loader',
      options: {
        failOnWarning: false,
        failOnError: true,
      },
    },
    {
      enforce: 'pre',
      test: /\.(ts|tsx)$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'tslint-loader',
      options: {
        failOnWarning: false,
        failOnError: true,
      },
    },
    {
      test: /\.tsx?$/,
      use: [
        {
          loader: 'awesome-typescript-loader',
          options: {
            silent: true,
            useBabel: true,
            babelOptions: {
              babelrc: false,
              compact: process.env.NODE_ENV === 'production',
              highlightCode: true,
            },
            babelCore: '@babel/core',
            useCache: true,
          }
        },
      ],
      exclude: /(node_modules|bower_components)/
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel-loader',
    },

    // these rules handle styles
    {
      test: /\.css$/,
      use: [
        { loader: MiniCssWebpackPlugin.loader },
        { loader: 'css-loader', options: { importLoaders: 1 } },
      ],
    },
    {
      test: /\.(scss|sass)$/,
      use: [
        { loader: MiniCssWebpackPlugin.loader },
        { loader: 'css-loader', options: { importLoaders: 1 } },
        'sass-loader'
      ],
    },
    {
      test: /\.less$/,
      use: [
        { loader: MiniCssWebpackPlugin.loader },
        { loader: 'css-loader', options: { importLoaders: 1 } },
        'less-loader'
      ],
    },

    // this rule handles images
    {
      test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
      use: 'file-loader?name=static/fonts/[name].[hash].[ext]',
    },

    // the following 3 rules handle font extraction
    {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=static/fonts/[name].[hash].[ext]',
    },
    {
      test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader?name=static/fonts/[name].[hash].[ext]',
    },
    {
      test: /\.otf(\?.*)?$/,
      use: 'file-loader?name=static/fonts/[name].[ext]&mimetype=application/font-otf',
    }],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    alias: {
      app: commonPaths.sourcePath,
      'app-static': path.resolve(__dirname, '../', 'static/'),
      '../../theme.config$': path.resolve(__dirname, '../', 'src/styles/semantic-ui/theme.config'),
      heading: path.resolve(__dirname, '../', 'src/semantic/heading.less'),
    },
    modules: [
      'src',
      'node_modules',
    ],
  },
  plugins: [
    new AsyncChunkNames(),
    new ManifestPlugin({
      seed: {
        name: "recoil-devtools-demo",
        short_name: "recoil-devtools-demo",
        start_url: "index.html",
        display: "standalone",
        icons: [
          {
            src: "favicon.ico",
            sizes: "512x512",
            type: "image/x-icon"
          }
        ],
        background_color: "#4e0041",
        theme_color: "#4e0041"
      },
    }),
    new CleanWebpackPlugin({
      root: commonPaths.root,
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: commonPaths.locales,
          to: 'locales',
          toType: 'dir',
        },
      ]
    }),
  ],
};

module.exports = config;
