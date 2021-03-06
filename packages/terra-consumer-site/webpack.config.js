// By default eslint assumes packages imported are supposed to be dependencies,
// not devDependencies. Disabling this rule in webpack.conig.js
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');

const path = require('path');
const Autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const I18nAggregatorPlugin = require('terra-i18n-plugin');
const i18nSupportedLocales = require('terra-i18n/lib/i18nSupportedLocales');
const CustomProperties = require('postcss-custom-properties');
const rtl = require('postcss-rtl');

const customProperties = CustomProperties({ preserve: true, warnings: false });
customProperties.setVariables({
  '--terra-base-font-family': 'Roboto, "Helvetica Neue", Helvetica, Arial, sans-serif',
  // Body
  '--terra-consumer-body-background-color': '#c7d4ea',
  // Nav
  '--terra-consumer-nav-background-color': 'rgba(255, 255, 255, 0.25)',
  '--terra-consumer-nav-width': '320px',
  '--terra-consumer-nav-link-color': '#3d3d3d',
  '--terra-consumer-nav-text-color': '#3d3d3d',
  '--terra-consumer-mobile-close-button-color': '#3d3d3d',
  // profile
  // TODO profile-link-border-background color is time being as we don't have best way to access background image
  '--terra-consumer-profile-link-border-background': '#c7d4ea',
  '--terra-consumer-profile-link-background': 'rgba(255, 255, 255, 0.25)',
  '--terra-consumer-profile-link-width': '320px',
  '--terra-consumer-profile-link-color': '#3d3d3d',
});


module.exports = {
  entry: {
    'babel-polyfill': 'babel-polyfill',
    'terra-consumer': path.resolve(path.join(__dirname, 'src', 'Index')),
  },
  module: {
    loaders: [{
      test: /\.(jsx|js)$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },
    {
      test: /\.json$/,
      loader: 'json-loader',
    },
    {
      test: /\.(scss|css)$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true,
            importLoaders: 2,
            localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
          },
        }, {
          loader: 'postcss-loader',
          options: {
            plugins() {
              return [
                Autoprefixer({
                  browsers: [
                    'ie >= 10',
                    'last 2 versions',
                    'last 2 android versions',
                    'last 2 and_chr versions',
                    'iOS >= 8',
                  ],
                }),
                customProperties,
                rtl(),
              ];
            },
          },
        },
        {
          loader: 'sass-loader',
        }],
      }),
    },
    {
      test: /\.md$/,
      loader: 'raw-loader',
    },
    {
      test: /\.(png|svg|jpg|gif)$/,
      use: [
        'file-loader',
      ],
    },
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name]-[hash].css'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      chunks: ['babel-polyfill', 'terra-consumer'],
    }),
    new I18nAggregatorPlugin({
      baseDirectory: __dirname,
      supportedLocales: i18nSupportedLocales,
    }),
    new webpack.NamedChunksPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'aggregated-translations'), 'node_modules'],

    // See https://github.com/facebook/react/issues/8026
    alias: {
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-intl': path.resolve(__dirname, 'node_modules/react-intl'),
      moment: path.resolve(__dirname, 'node_modules/moment'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'source-map',
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    stats: {
      assets: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: true,
      warnings: true,
    },
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  resolveLoader: {
    modules: [path.resolve(path.join(__dirname, 'node_modules'))],
  },
};
