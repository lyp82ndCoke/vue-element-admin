/**
 * 控制进度条样式
 * 控制用户权限跳转
 *      meat.name对比role中的权限  有的话进入 没有的话404
 */

import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

console.log(store, "store")
const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  console.log('路由重定向之前:', from)
  console.log('路由重定向之后:', to)
  console.log("参数", to.code)
  const roles = store.getters.roles
  console.log(to.meta.className, 'to.meta.className')
  const role = to.name;
  const className = to.meta.className;
  // return false;
  // router.options.routes = {};
  NProgress.start()
  if (getToken()) {
    if (to.query.code) {
      const code = to.query.code;


      const wx_unionid = store.getters.unionid;
      console.log('路由跳转')
      console.log('wx_unionid', wx_unionid)
      if (!wx_unionid) {
        store
          .dispatch('BindWxUnionid', code).then(res => {

          }).catch(err => {
            // alert('路由跳转错误', err)
          })
      }

      // const wx_unionid = store.state.user.unionid;

      // if (!wx_unionid) {
      //   store
      //     .dispatch('BindWxUnionid', code).then(res => {
      //       alert("res", res)
      //     }).catch(err => {
      //       alert('路由跳转错误', err)
      //     })
      // }

    }

    if (to.path === '/login') {
      setTimeout(() => {
        next({ path: '/', query: to.query })
      }, 200)
      NProgress.done() // if current page is home will not trigger	afterEach hook, so manually handle it
    } else {
      // 判断用户权限
      if (store.getters.roles.length === 0) {
        // console.log(store.getters.roles.length)
        // 用户权限没有的时候，获取用户权限
        store
          .dispatch('GetInfo')
          .then(res => {
            console.log('验证用户权限')
            // 拉取用户信息
            const newRoles = store.getters.roles
            if (role && newRoles.indexOf(role) === -1) {
              const newData = new Date().getTime()
              next({ path: '/404', query: { t: newData } })
            } else {
              console.log(store.getters)
              const wx_unionid = store.getters.unionid;
              let APPID = "wxec395e2c015ff846", REDIRECT_URI = window.location.href;
              if (!wx_unionid && !to.query.code) {
                if (from.path == "/login") {
                  REDIRECT_URI = `${window.location.origin}/${router.options.base}/home`
                }

                window.location.href = `https://open.weixin.qq.com/connect/qrconnect?appid=${APPID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=snsapi_login#wechat_redirect`
              }
            }
            next()
          })
          .catch(err => {
            store.dispatch('FedLogOut').then(() => {
              Message.error(err || 'Verification failed, please login again')
              next({ path: '/' })
            })
          })
      } else {
        // 用户有权限的时候
        console.log(role, '+++++++++++')
        // console.log(roles.indexOf(role))
        if (role && roles.indexOf(role) === -1) {
          const newData = new Date().getTime()
          next({ path: '/404', query: { t: newData } })
        }
        else if (role === undefined) {
          // console.log(className,':className')
          if (className && roles.indexOf(className) === -1) {
            console.log(className, roles)
            const newData = new Date().getTime()
            next({ path: '/404', query: { t: newData } })
          }
        }
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
