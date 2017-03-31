module.exports = {
  ui: 'jasmine2',
  browsers: [
    {
      name: 'chrome',
      version: 'latest',
    },
    {
      name: 'firefox',
      version: 'latest',
    },
    {
      name: 'safari',
      version: 'latest',
    }
  ],
  builder: 'zuul-builder-webpack',
  webpack: require('./webpack.config.js')
};
