const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const nodeExternals = require('webpack-node-externals');

const resolve = {
    extensions: [".js", ".ts", ".jsx", ".tsx"],
    plugins: [
    ],
  };

module.exports = {
  entry: './src/index.js',
  externals: [nodeExternals()],
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'ComponentLib',
    libraryTarget: 'commonjs'
  },
  // watch: true,
  // watchOptions: {
  //   ignored: /node_modules/,
  // },
  plugins: [
      new CleanWebpackPlugin({
        dry: true,
      }),
      new MiniCssExtractPlugin({
        // filename: "clientlib-[name]/[name].css",
        filename: "css/[name].css",
        chunkFilename: 'css/[id].css'
      }),
  ],
  module: {
    rules: [
     {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
    //   { 
    //     test: /\.scss$/,
    //     use: ['style-loader', 'css-loader', 'sass-loader'],
    //     include: path.resolve(__dirname, './src')
    //   }
    {
        // test: /\.scss$/,
        test: /\.(sa|sc|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: false,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              plugins() {
                return [require("autoprefixer")];
              },
            },
          },
          {
            loader: "sass-loader",
          },
          {
            loader: "glob-import-loader",
            options: {
              resolve: resolve,
            },
          },
        ],
      },
    ]
  }
}
