const path = require('path');
const mainConfig = require('./webpack.config.js');

module.exports = {
  ...mainConfig,

  entry: {
    'Regions': './src/plugins/regions.ts',
  },

  output: {
    globalObject: 'WaveSurfer',
    library: '[name]',
    libraryTarget: 'umd',
    libraryExport: 'default',
    filename: 'wavesurfer.[name].min.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
