const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const path = require('path');

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
        test: /\.(scss|css)$/i,
        use: [
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
            loader: require.resolve('postcss-loader'),
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
                      if (selector.match(/^(html)/)) {
                        // return selector.replace(/^([^\s]*)/, `$1 ${prefix}`);
                        return `${selector}${prefix}`;
                      }
                      if (filePath.match(/node_modules/)) {
                        return selector; // Do not prefix styles imported from node_modules
                      }
                      if (selector === ':root') {
                        // return selector.replace(/^([^\s]*)/, `$1 ${prefix}`);
                        return selector;
                      }
                      if (filePath.includes('/dist/')) {
                        return selector; // Do not prefix styles imported from dist
                      }
                      const annotation = rule.prev();
                      if (
                        annotation?.type === 'comment' &&
                        annotation.text.trim() === 'no-prefix'
                      ) {
                        // Do not prefix style rules that are preceded by: /* no-prefix */
                        return selector;
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
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
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
    new ModuleFederationPlugin({
      name: 'visaService',
      filename: 'remoteEntry.js',
      exposes: {
        './VisaServiceApp': './src/App',
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
