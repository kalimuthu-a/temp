const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',

  output: {
    publicPath: 'auto',
    filename: '[name][contenthash].js',
    clean: true,
  },

  optimization: {
    runtimeChunk: false,
  },

  devServer: {
    host: 'localhost',
    port: 8089,
    historyApiFallback: true,
    hot: false,
    liveReload: true,
    client: {
      logging: 'none',
      overlay: false,
    },
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.post('*', (req, res) => {
        res.redirect(req.originalUrl);
      });

      return middlewares;
    },
  },

  module: {
    rules: [
      // {
      //   test: /\.(scss|css)$/i,
      //   use: [
      //     'style-loader',
      //     'css-loader',
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         postcssOptions: {
      //           plugins: {
      //             'postcss-prefix-selector': {
      //               prefix: '.In6e2',
      //               transform(
      //                 prefix,
      //                 selector,
      //                 prefixedSelector,
      //                 filePath,
      //                 rule,
      //               ) {
      //                 if (filePath.match(/react-datepicker/)) {
      //                   return `${prefix} ${selector}`;
      //                 }
      //                 // whitlist classname for body tag involved classes-booking widget
      //                 if (
      //                   selector.match(/booking-widget-sticky-active/) ||
      //                   selector.match(/modify-widget-body/) ||
      //                   selector.match(/no-scroll-on-flight-loader/) ||
      //                   selector.match(/scroll-is-disable-for-dialog/) ||
      //                   selector.match(/hurryup-timer-active/) ||
      //                   selector.match(
      //                     /no-scroll-session-timeout-container-app/,
      //                   ) ||
      //                   selector.match(/no-scroll-on-popup/) ||
      //                   selector.match(/^(no-scroll)/)
      //                 ) {
      //                   return selector;
      //                 }
      //                 if (selector.match(/^(html)/)) {
      //                   // return selector.replace(/^([^\s]*)/, `$1 ${prefix}`);
      //                   return `${selector}${prefix}`;
      //                 }
      //                 if (selector === ':root') {
      //                   // return selector.replace(/^([^\s]*)/, `$1 ${prefix}`);
      //                   return selector;
      //                 }
      //                 if (filePath.match(/node_modules/)) {
      //                   return selector; // Do not prefix styles imported from node_modules
      //                 }
      //                 if (filePath.includes('/dist/')) {
      //                   return selector; // Do not prefix styles imported from dist
      //                 }
      //                 const annotation = rule.prev();
      //                 if (
      //                   annotation?.type === 'comment' &&
      //                   annotation.text.trim() === 'no-prefix'
      //                 ) {
      //                   return selector; // Do not prefix style rules that are preceded by: /* no-prefix */
      //                 }

      //                 return prefixedSelector;
      //               },
      //             },
      //             autoprefixer: {
      //               overrideBrowserslist: ['last 4 versions'],
      //             },
      //           },
      //         },
      //       },
      //     },
      //     {
      //       loader: 'sass-loader',
      //       options: {
      //         sourceMap: true,
      //       },
      //     },
      //   ],
      // },
    ],
  },
});
