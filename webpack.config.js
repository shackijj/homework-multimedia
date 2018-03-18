const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: './src/App.js',
  output: {
    path: path.resolve(__dirname, 'public/assets'),
    filename: 'bundle.js',
    publicPath: '/assets/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.worker\.js$/,
        use: {
          loader: 'worker-loader'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['public/assets'])
  ]
};
