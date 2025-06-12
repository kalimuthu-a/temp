const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const deps = require('./package.json').dependencies;

module.exports = {
  mode: 'development',
  output: {
    publicPath: 'auto',
    filename: '[name].[contenthash].js',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },

  module: {
    rules: [
      {
        test: /\.m?js/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(scss|css)$/i,
        use: [
          // MiniCssExtractPlugin.loader,
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: {
                  'postcss-prefix-selector': {
                    prefix: '.In6e2',
                    transform(
                      prefix,
                      selector,
                      prefixedSelector,
                      filePath,
                      rule,
                    ) {
                      if (filePath.match(/react-datepicker/)) {
                        return `${prefix} ${selector}`;
                      }
                      // whitlist classname for body tag involved classes-booking widget
                      if (
                        selector.match(/booking-widget-sticky-active/) ||
                        selector.match(/modify-widget-body/) ||
                        selector.match(/no-scroll-on-flight-loader/) ||
                        selector.match(/scroll-is-disable-for-dialog/) ||
                        selector.match(/hurryup-timer-active/) ||
                        selector.match(
                          /no-scroll-session-timeout-container-app/,
                        ) ||
                        selector.match(/no-scroll-on-popup/) ||
                        selector.match(/^(no-scroll)/)
                      ) {
                        return selector;
                      }
                      if (selector.match(/^(html)/)) {
                        // return selector.replace(/^([^\s]*)/, `$1 ${prefix}`);
                        return `${selector}${prefix}`;
                      }
                      if (selector === ':root') {
                        // return selector.replace(/^([^\s]*)/, `$1 ${prefix}`);
                        return selector;
                      }
                      if (filePath.match(/node_modules/)) {
                        return selector; // Do not prefix styles imported from node_modules
                      }
                      if (filePath.includes('/dist/')) {
                        return selector; // Do not prefix styles imported from dist
                      }
                      const annotation = rule.prev();
                      if (
                        annotation?.type === 'comment' &&
                        annotation.text.trim() === 'no-prefix'
                      ) {
                        return selector; // Do not prefix style rules that are preceded by: /* no-prefix */
                      }

                      return prefixedSelector;
                    },
                  },
                  autoprefixer: {
                    overrideBrowserslist: ['last 4 versions'],
                  },
                },
              },
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {},
          },
        ],
      },
    ],
  },

  plugins: [
    // new MiniCssExtractPlugin({
    //   filename: 'itineraryv2.css',
    // }),
    new ModuleFederationPlugin({
      name: 'itinerary',
      filename: 'remoteEntry.js',
      exposes: {
        './ItineraryApp': './src/App',
      },
      shared: {
        ...deps,
        react: {
          singleton: true,
          requiredVersion: deps.react,
        },
        'react-dom': {
          singleton: true,
          requiredVersion: deps['react-dom'],
        },
      },
    }),
    new HtmlWebPackPlugin({
      template: './public/index.html',
    }),
    new webpack.DefinePlugin({
      LOGIN_ENV: process.env.NODE_ENV,
    }),
  ],
};
