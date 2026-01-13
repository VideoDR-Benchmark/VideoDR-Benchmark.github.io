const { defineConfig } = require('@vue/cli-service')
const globalConfig = require('./global-layout-config.json')

module.exports = defineConfig({
  productionSourceMap: false,
  transpileDependencies: true,
  publicPath: './',
  devServer: {
    port: 8080,
    open: true
  },
  outputDir: 'docs',
  css: {
    loaderOptions: {
      css: {
        sourceMap: process.env.NODE_ENV !== 'production'
      }
    }
  },
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = globalConfig.projectInfo.name
        return args
      })
  }
})
