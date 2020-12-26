import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/font_login/iconfont.css'
import './assets/font_navigate/iconfont.css'

/*配置axios后台请求*/
import axios from 'axios'
import Axios from "axios";
Axios.defaults.headers.post['Content-Type']='application/x-www-form-urlencoded;charset=utf-8';
axios.defaults.baseURL="http://127.0.0.1:8888/"
axios.interceptors.request.use(config=>{
  config.headers.Authorization=window.sessionStorage.getItem('token');
  return config;
})
Vue.prototype.$http=axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
