import Layout from '@/views/layout/Layout'
import View from '@/views/layout/View'
const socialNetworkRouter = {
  path: '/socialNetwork',
  name: 'socialNetwork',
  hidden: true,
  component: Layout,
  redirect: '/socialNetwork/counselorMang/index',
  meta: {
    title: '社会化网络',
    icon: 'network'
  },
  children: [
    {
      path: 'counselorMang',
      name: 'counselorMang',
      hidden: true,
      component: View,
      meta: {
        title: '辅导员管理',
        icon: 'counselorMang'
      },
      children: [
        {
          path: 'index',
          name: 'counselorMang',
          hidden: true,
          component: () => import('@/views/socialNetwork/counselorMang/index'),
          meta: { icon: 'counselorMang' }
        },
        {
          path: 'add/:id',
          hidden: true,
          component: () => import('@/views/socialNetwork/counselorMang/new'),
          meta: { title: '添加辅导员', className: 'counselorMang' }
        }
      ]
    },
    // {
    //     path: 'counselorStatus',
    //     name: 'counselorStatus',
    //     hidden: true,
    //     component: View,
    //     meta: {
    //         title: '辅导员排班状态查询',
    //         icon: 'counselorStatus'
    //     },
    //     component: () =>
    //         import ('@/views/socialNetwork/counselorStatus'),
    // },
    {
      path: 'scheduMang',
      name: 'scheduMang',
      hidden: true,
      component: View,
      redirect: '/socialNetwork/scheduMang/index',
      meta: { title: '排班管理', icon: 'schedule' },
      children: [
        {
          path: 'index',
          hidden: true,
          name: 'scheduMang',
          component: () => import('@/views/socialNetwork/scheduMang')
        },
        {
          path: 'news/:id',
          hidden: true,
          component: () => import('@/views/socialNetwork/scheduMang/news'),
          meta: { title: '添加排班', icon: 'schedule', className: 'scheduMang' }
        }
      ]
    },
    {
      path: 'integralMang',
      name: 'integralMang',
      hidden: true,
      meta: { title: '贡献值管理', icon: 'integralMang' },
      component: () => import('@/views/socialNetwork/integralMang')
    },
    {
      path: 'counselorRanking',
      name: 'counselorRanking',
      hidden: true,
      meta: { title: '排行榜查询', icon: 'ranking' },
      component: () => import('@/views/socialNetwork/counselorRanking')
    }
  ]
}

const teachMangRouter = {
  path: '/teachMang',
  name: 'teachMang',
  hidden: true,
  component: Layout,
  meta: {
    title: '教研管理',
    icon: 'teachMang'
  },
  children: [
    {
      path: 'index',
      name: 'teachMang',
      hidden: true,
      component: () => import('@/views/socialNetwork/teachMang/index'),
      meta: { icon: 'teachMang' }
    },
    {
      path: 'add/:id',
      hidden: true,
      component: () => import('@/views/socialNetwork/teachMang/new'),
      meta: { title: '添加教研', className: 'teachMang' }
    }
  ]
}

export { socialNetworkRouter, teachMangRouter }
