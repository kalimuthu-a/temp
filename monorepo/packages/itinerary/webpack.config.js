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
    port: 8087,
    historyApiFallback: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    hot: false,
    liveReload: true,
    client: {
      logging: 'none',
    },
  },
});
