import Layout from '@/views/layout/Layout'
import View from '@/views/layout/View'
const drainageRouter = {
  path: '/drainage',
  name: 'drainage',
  redirect: '/drainage/officialAccount/index',
  component: Layout,
  hidden: true,
  meta: {
    title: '订阅号活动',
    icon: 'official'
  },
  children: [
    {
      path: 'officialAccount',
      name: 'officialAccount',
      hidden: true,
      meta: {
        title: '公众号管理',
        icon: 'officialmanage'
      },
      component: View,
      children: [
        {
          path: 'index',
          name: 'officialAccount',
          hidden: true,
          component: () => import('@/views/activity/official/index'),
          meta: {
            icon: 'officialmanage'
          }
        },
        {
          path: 'news/:id',
          hidden: true,
          component: () => import('@/views/activity/news/offical'),
          meta: {
            title: '新建公众号',
            icon: 'setting',
            className: 'activity'
          }
        }
      ]
    },
    {
      path: 'activity',
      name: 'activity',
      redirect: '/drainage/activity/index/index',
      hidden: true,
      meta: {
        title: '活动管理',
        icon: 'account'
      },
      component: View,
      children: [
        {
          path: 'index',
          name: 'activity',
          hidden: true,
          component: () => import('@/views/activity/index/index'),
          meta: {
            icon: 'account'
          }
        },
        {
          path: 'news/:id',
          hidden: true,
          component: () => import('@/views/activity/news'),
          meta: {
            title: '新建活动',
            icon: 'setting',
            className: 'activity'
          }
        },
        {
          path: 'content/:id',
          hidden: true,
          component: () => import('@/views/activity/content'),
          meta: {
            title: '内容管理',
            className: 'activity'
          }
        },
        {
          path: 'banner/:id',
          hidden: true,
          component: () => import('@/views/activity/banner'),
          meta: {
            title: '广告管理',
            className: 'activity'
          }
        }
        // {
        //   path: 'banner/adv/:id',
        //   hidden:true,
        //   component: () => import('@/views/activity/news/adv'),
        //   meta: {
        //     title: '新建广告',
        //     className: 'activity',
        //   }
        // }
      ]
    },
    {
      path: 'goods',
      name: 'goods',
      hidden: true,
      component: View,
      meta: {
        title: '商品管理',
        icon: 'goods'
      },
      children: [
        {
          path: 'index',
          name: 'activity',
          hidden: true,
          component: () => import('@/views/activity/goods/index'),
          meta: {
            icon: 'goods'
          }
        },
        {
          path: 'goods/:id',
          hidden: true,
          component: () => import('@/views/activity/goods/new'),
          meta: {
            title: '新建商品',
            icon: 'goods',
            className: 'activity'
          }
        },
        {
          path: 'content/:id',
          hidden: true,
          component: () =>
            import('@/views/activity/goodcontent/index'),
          meta: {
            title: '内容管理',
            className: 'activity'
          }
        }
      ]
    },
    {
      path: 'media',
      name: 'media',
      hidden: true,
      component: View,
      meta: {
        title: '素材管理',
        icon: 'media'
      },
      children: [
        {
          path: 'index',
          name: 'activity',
          hidden: true,
          component: () => import('@/views/activity/source/index'),
          meta: {
            icon: 'media'
          }
        },
        {
          path: 'source/:id',
          hidden: true,
          component: () => import('@/views/activity/material/index'),
          meta: {
            title: '新建素材',
            icon: 'media',
            className: 'activity'
          }
        }
      ]
    }
  ]
}

export default drainageRouter
