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
          compress: {
            drop_console: true,
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
    ],
  },
});
