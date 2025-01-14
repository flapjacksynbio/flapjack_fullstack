/* eslint-disable no-undef */
const { override, fixBabelImports, addBabelPlugin } = require('customize-cra')

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css',
  }),
  addBabelPlugin('babel-plugin-root-import'),
)
