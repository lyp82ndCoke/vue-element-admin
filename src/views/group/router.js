import Layout from '@/views/layout/Layout'
import View from '@/views/layout/View'
const groupRouter = {
  path: '/group',
  name: 'group',
  redirect: '/group/h5-goods/index',
  component: Layout,
  hidden: true,
  meta: {
    title: '商城',
    icon: 'official'
  },
  children: [
    {
      path: 'h5-goods',
      name: 'h5-goods',
      redirect: '/h5-goods/index',
      hidden: true,
      meta: {
        title: '商品管理'
      },
      component: View,
      children: [
        {
          path: 'index',
          name: 'h5-goods',
          hidden: true,
          component: () => import('@/views/group/goods'),
          meta: {
            icon: 'officialmanage'
          }
        },
        {
          path: 'news/:id',
          hidden: true,
          component: () => import('@/views/group/goods/news'),
          meta: {
            title: '新建商品',
            icon: 'setting',
            className: 'h5-goods'
          }
        }
      ]
    },
    {
      path: 'groupmanage',
      name: 'groupmanage',
      redirect: '/groupmanage/index',
      hidden: true,
      component: View,
      children: [
        {
          path: 'index',
          hidden: true,
          name: 'groupmanage',
          component: () => import('@/views/group/groupmanage/index'),
          meta: {
            icon: 'documentation',
            title: '库存管理'
          }
        },
        {
          path: 'skus',
          hidden: true,
          component: () =>
            import('@/views/group/groupmanage/sukDetails'),
          meta: {
            title: '库存详情',
            className: 'groupmanage'
          }
        },
        {
          path: 'userDetails/:id',
          hidden: true,
          component: () =>
            import('@/views/group/groupmanage/groupDetails'),
          meta: {
            title: '群明细',
            className: 'groupmanage'
          }
        },
        {
          path: 'goods/:id',
          hidden: true,
          component: () => import('@/views/group/groupmanage/goods'),
          meta: {
            title: '规格级',
            className: 'groupmanage'
          }
        }
      ]
    },
    {
      path: 'groupqrcode',
      name: 'groupqrcode',
      hidden: true,
      component: () => import('@/views/group/qrcode/code'),
      meta: {
        icon: 'list',
        title: '二维码管理'
      }
    },
    {
      path: 'grouporder',
      name: 'grouporder',
      hidden: true,
      component: View,
      meta: {
        title: '订单管理',
        icon: 'media'
      },
      children: [
        {
          path: 'index',
          name: 'grouporder',
          hidden: true,
          component: () => import('@/views/group/orders/index'),
          meta: {
            icon: 'media'
          }
        },
        {
          path: 'details',
          hidden: true,
          component: () => import('@/views/group/orders/details')
        }
      ]
    },
    {
      path: 'micropage',
      name: 'micropage',
      hidden: true,
      component: View,
      meta: {
        title: '微页面',
        icon: 'account'
      },
      children: [
        {
          path: 'index',
          name: 'micropage',
          hidden: true,
          component: () => import('@/views/group/micropage')
        },
        {
          path: 'edit/:id',
          hidden: true,
          component: () => import('@/views/group/micropage/edit')
        }
      ]
    },
    {
      path: 'wechatGroup',
      name: 'wechatGroup',
      hidden: true,
      component: View,
      meta: {
        title: '微信群管理',
        icon: 'officialmanage'
      },
      children: [
        {
          path: 'index',
          name: 'wechatGroup',
          hidden: true,
          component: () => import('@/views/group/wechat/index')
        },
        {
          path: 'detail/:id',
          hidden: true,
          component: () => import('@/views/group/wechat/detail')
        }
      ]
    }
  ]
}
export default groupRouter
