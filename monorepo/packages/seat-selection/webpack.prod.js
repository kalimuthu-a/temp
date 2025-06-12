const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production',
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          format: {
            comments: false,
          },
        },
      }),
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              calc: true,
              convertValues: true,
              discardComments: {
                removeAll: true,
              },
              discardDuplicates: true,
              discardEmpty: true,
              mergeRules: true,
              normalizeCharset: true,
              reduceInitial: true, // This is since IE11 does not support the value Initial
              svgo: true,
            },
          ],
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        main: {
          chunks: 'all',
          name: 'site',
          test: 'main',
          enforce: true,
        },
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]((?!(react-dom|react)).*)[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  performance: { hints: false },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: [
          MiniCssExtractPlugin.loader,
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
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource'
      },
    ],
  },
});
