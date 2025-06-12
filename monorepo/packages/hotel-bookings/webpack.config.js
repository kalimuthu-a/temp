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
    runtimeChunk: 'single',
  },

  devServer: {
    host: 'localhost',
    port: 8082,
    historyApiFallback: true,
    hot: false,
    liveReload: true,
    client: {
      logging: 'none',
    },
  },
});
