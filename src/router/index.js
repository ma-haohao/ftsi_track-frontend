import Vue from 'vue'
import Router from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from "../components/Welcome.vue";
import FtsiList from '../components/FtsiMgr/FtsiList.vue'
import TaskQuery from '../components/FtsiOperation/taskQuery.vue'
import TaskSubmit from '../components/FtsiOperation/taskSubmit.vue'
import CacheArea from '../components/FtsiOperation/cacheArea.vue'
import CacheSubmit from '../components/FtsiOperation/cacheSubmit.vue'
import SubmitRecord from '../components/History/submitRecord.vue'
import FTSIRecord from '../components/History/ftsiModifyRecord.vue'
import PendingList from '../components/FtsiMgr/pendingList.vue'
import SubmitFalied from '../components/History/submitFailed.vue'
Vue.use(Router)

const router = new Router({
  routes:[
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {path:'/home',component:Home,redirect: '/welcome',
      children:[
        {path:'/welcome',component:Welcome},
        {path:'/ftsilist',component: FtsiList},
        {path:'/taskquery',component: TaskQuery},
        {path:'/tasksubmit',component: TaskSubmit},
        {path:'/cachearea',component: CacheArea},
        {path:'/cachesubmit',component: CacheSubmit},
        {path:'/submitrecord',component: SubmitRecord},
        {path:'/ftsirecord',component: FTSIRecord},
        {path:'/pendingList',component: PendingList},
        {path:'/submitFailed',component: SubmitFalied}
      ]}
  ]
})

//挂载路由导航守卫
router.beforeEach((to,from,next)=>{
  if(to.path==='/login') return next();
  const tokenStr=window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
