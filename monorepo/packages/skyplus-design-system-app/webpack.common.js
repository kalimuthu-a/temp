const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const glob = require('glob');

const SOURCE_ROOT = `${__dirname}/src/common`;

const entry = glob
  .sync('./src/{components,functions}/**/*.js', {
    ignore: './src/**/*.stories.js',
  })
  .reduce((acc, filePath) => {
    const filename = filePath.replace(/^.*[\\\/]/, '').replace('.js', '');
    acc[filename] = filePath;
    return acc;
  }, {});
entry.styles = './src/common/scss/main.scss';

const resolve = {
  extensions: ['.jsx', '.js'],
  plugins: [],
};

module.exports = {
  entry,
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/des-system'),
    libraryTarget: 'commonjs2',
    clean: true,
  },

  plugins: [
    new CleanWebpackPlugin({
      dry: true,
      protectWebpackAssets: false,
      cleanAfterEveryBuildPatterns: ['*.LICENSE.txt'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.svg$/,
        loader: 'svg-url-loader',
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: false,
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
            options: {},
          },
          {
            loader: 'glob-import-loader',
            options: {
              resolve,
            },
          },
        ],
      },
    ],
  },

  externals: {
    react: 'commonjs react',
    'react-dom': 'commonjs react-dom',
  },
};
