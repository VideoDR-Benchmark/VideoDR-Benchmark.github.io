const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
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
  }
})
