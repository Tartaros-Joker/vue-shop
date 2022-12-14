const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false
})

module.exports = {
  chainWebpack: config => {
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main-prod.js')

      // config.set('externals', {
      //   axios: 'axios',
      //   lodash: '_',
      //   echarts: 'echarts',
      //   nprogress: 'NProgress',
      //   'vue-quill-editor': 'VueQuillEditor'
      // })
    })
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main-dev.js')
    })
  }
}
