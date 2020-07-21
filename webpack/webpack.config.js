const libraryName = 'gowizSearchbar';
const { merge } = require('webpack-merge');


const baseConfig = {
  entry: './src/index.tsx',
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
};

const umdConfig = merge(baseConfig, {
  output: {
    path: `${__dirname}/../dist`,
    filename: 'gowizSearchbar.min.js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  }
});

const npmConfig = merge(baseConfig, {
  output: {
    path: `${__dirname}/../lib`,
    filename: 'gowizSearchbar.js',
    library: libraryName,
    libraryTarget: 'commonjs2'
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'awesome-typescript-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  }
});

module.exports = [umdConfig, npmConfig];