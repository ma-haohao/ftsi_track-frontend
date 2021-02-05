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

/*loading 全局加载*/
import {Loading} from 'element-ui'
import { Message } from 'element-ui';
let loading;
//内存中正在请求的数量
let loadingNum=0;
function startLoading() {
  if(loadingNum===0){
    loading = Loading.service({
      lock: true,
      text: 'Loading...',
      background:'rgba(255,255,255,0.5)',
    })
  }
  //请求数量加1
  loadingNum++;
}
function endLoading() {
  //请求数量减1
  loadingNum--
  if(loadingNum<=0){
    loading.close()
  }
}
//请求数据拦截器
axios.interceptors.request.use(request => {
  startLoading();
  return request
}, err => {
  return Promise.reject(err);
});

//接收响应拦截器
axios.interceptors.response.use(response => {
  endLoading();
  return response
}, err => {
  endLoading();
  if (err && err.response) {
    switch (err.response.status) {
      case 404: Message.error('The current user has no permission.'); break;
      case 403: router.push('/login'); Message.error('Signature has expired.');break;
      case 500: Message.error('Internal server error(500)'); break;
      default: err.message = `connection error(${err.response.status})!`;
    }
  } else {
    err.message = 'connection of server failed!'
  }
  return Promise.reject(err);
});

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
