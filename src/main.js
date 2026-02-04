import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import VueResource from 'vue-resource'
import VueI18n from 'vue-i18n'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'babel-polyfill'
import 'es6-promise/auto'

Vue.use(VueResource)
Vue.use(VueI18n)
Vue.use(ElementUI)

Vue.config.productionTip = false

const i18n = new VueI18n({
  locale: 'zh-CN',
  messages: {}
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
