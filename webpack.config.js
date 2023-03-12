const path = require('path');

module.exports = {
  mode: 'production',

  entry: {
    'wavesurfer': './src/index.ts',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    extensionAlias: {
      '.js': '.ts',
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },
  output: {
    library: 'WaveSurfer',
    libraryTarget: 'umd',
    libraryExport: 'default',
    globalObject: 'this',
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
