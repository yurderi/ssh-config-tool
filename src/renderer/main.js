import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

// Setup basic styling
import '@yurderi/vue-ui/dist/vue-ui.css'
import VueUI from '@yurderi/vue-ui/dist/vue-ui.js'
import '@/assets/less/all.less'

Vue.use(VueUI)

// Setup codemirror
import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/yaml/yaml.js'

Vue.use(VueCodemirror)

// Setup sweet alert
Vue.prototype.$swal   = require('sweetalert2')
Vue.prototype.$config = require('electron-settings')

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
