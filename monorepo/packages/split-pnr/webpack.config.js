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
    splitChunks: false,
  },

  devServer: {
    host: 'localhost',
    port: 8120,
    historyApiFallback: true,
    hot: false,
    liveReload: true,
    client: {
      logging: 'none',
    },
    setupMiddlewares: (middlewares, devServer) => {
      devServer.app.post('*', (req, res) => {
        res.redirect(req?.originalUrl?.replace?.('mock', "mock/post"));
      });

      return middlewares;
    },
  },
});
