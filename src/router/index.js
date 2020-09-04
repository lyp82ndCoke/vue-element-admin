import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// // let constantRouterMap;
//  const constantRouterMap = '';
//  console.log(constantRouterMap)
// export default new Router({
//   // mode: 'history', //后端支持可开
//   scrollBehavior: () => ({
//     y: 0
//   }),
//   routes: constantRouterMap
// })

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

/* Layout */
import Layout from '../views/layout/Layout'
// import View from '../views/layout/View'

import groupRouter from '@/views/group/router'
import growthRouter from '@/views/growth/router'
import goodMotherRouter from '@/views/goodMother/router'
import marketRouter from '@/views/goodMother/marketRouter'
import drainageRouter from '@/views/activity/router'
import counselorRouter from '@/views/counselor/router'
import { socialNetworkRouter, teachMangRouter } from '@/views/socialNetwork/router'
import tutorRouter from '@/views/tutor/router'
import projectManagerRouter from '@/views/projectManager/router'
import staffRouter from '@/views/staff/router'

/**
* hidden    : true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name    : 'router-name'             the name is used by <keep-alive> (must set!!!)
* meta    : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon : 'svg-name'             the icon show in the sidebar,
  }
**/

export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/resetPassword',
    component: () => import('@/views/login/resetPassword'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    name: 'home',
    hidden: true,
    meta: { title: '主页' },
    children: [
      {
        path: 'home',
        component: () => import('@/views/home/index')
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  },
  groupRouter,
  growthRouter,
  goodMotherRouter,
  marketRouter,
  drainageRouter,
  counselorRouter,
  socialNetworkRouter,
  teachMangRouter,
  tutorRouter,
  projectManagerRouter,
  staffRouter
  // {
  //   path: '/trainCamp',
  //   name: 'trainCamp',
  //   redirect: '/trainCamp/stock/index',
  //   component: Layout,
  //   hidden: true,
  //   meta: {
  //     title: '训练营(群)',
  //     icon: 'example'
  //   },
  //   children: [
  //     {
  //       path: 'camp-goods',
  //       name: 'camp-goods',
  //       redirect: '/camp-goods/index',
  //       hidden: true,
  //       meta: {
  //         title: '训练营商品管理'
  //       },
  //       component: View,
  //       children: [
  //         {
  //           path: 'index',
  //           name: 'camp-goods',
  //           hidden: true,
  //           component: () => import('@/views/trainCamp/goods'),
  //           meta: {
  //             icon: 'officialmanage'
  //           }
  //         },
  //         {
  //           path: 'news/:id',
  //           hidden: true,
  //           component: () => import('@/views/trainCamp/goods/news'),
  //           meta: {
  //             title: '新建商品',
  //             icon: 'setting',
  //             className: 'camp-goods'
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'trainstock',
  //       name: 'trainstock',
  //       redirect: '/stock/index',
  //       hidden: true,
  //       component: View,
  //       children: [
  //         {
  //           path: 'index',
  //           hidden: true,
  //           name: 'trainstock',
  //           component: () => import('@/views/trainCamp/stock/groupList'),
  //           meta: {
  //             title: '库存管理',
  //             icon: 'table'
  //           }
  //         },
  //         {
  //           path: 'details',
  //           hidden: true,
  //           component: () =>
  //             import('@/views/trainCamp/stock/sukDetails'),
  //           meta: {
  //             title: '库存详情',
  //             className: 'trainstock'
  //           }
  //         },
  //         {
  //           path: 'userlist/:id',
  //           hidden: true,
  //           component: () =>
  //             import('@/views/trainCamp/stock/groupUsersList'),
  //           meta: {
  //             title: '群明细',
  //             className: 'trainstock'
  //           }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'trainqrcode',
  //       name: 'trainqrcode',
  //       hidden: true,
  //       component: () => import('@/views/trainCamp/qrcode/index'),
  //       meta: {
  //         icon: 'account',
  //         title: '二维码管理'
  //       }
  //     },
  //     {
  //       path: 'trainorder',
  //       name: 'trainorder',
  //       hidden: true,
  //       component: View,
  //       meta: {
  //         title: '订单管理',
  //         icon: 'media'
  //       },
  //       component: () => import('@/views/trainCamp/orders')
  //     }
  //     // {
  //     //   path: 'member-stock',
  //     //   name: 'member-stock',
  //     //   hidden: true,
  //     //   component: View,
  //     //   meta: {
  //     //     title: '会员库存管理',
  //     //     icon: 'answers'
  //     //   },
  //     //   component: () =>
  //     //     import ('@/views/member/stockManage'),
  //     // }
  //   ]
  // }
]
console.log('路由规则：', process.env.NODE_ENV)
export default new Router({
  mode: 'history', // 后端支持可开
  // base: 'devzmbg', //测试环境
  // base: 'zmbg', //正式环境
  base: process.env.NODE_ENV === 'production' ? 'zmbg' : 'devzmbg',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
