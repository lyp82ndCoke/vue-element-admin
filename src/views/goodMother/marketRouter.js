import Layout from '@/views/layout/Layout'
import View from '@/views/layout/View'

const marketToolsRouter = {
  path: '/marketTools',
  name: 'marketTools',
  redirect: '/marketTools/giftCard/index',
  component: Layout,
  hidden: true,
  meta: {
    title: '营销工具',
    icon: 'star'
  },
  children: [
    {
      path: 'giftCard',
      name: 'giftCard',
      redirect: '/goodMother/marketTools/giftCard/index',
      hidden: true,
      meta: {
        title: '礼品卡'
      },
      component: View,
      children: [
        {
          path: 'index',
          name: 'giftCard',
          hidden: true,
          component: () =>
            import('@/views/goodMother/marketTools/giftCard/index'),
          meta: {
            icon: 'officialmanage'
          }
        },
        {
          path: 'news/:id',
          hidden: true,
          component: () =>
            import('@/views/goodMother/marketTools/giftCard/goodnew'),
          meta: {
            className: 'giftCard',
            title: '新建礼品卡'
          }
        },
        {
          path: 'ticket',
          hidden: true,
          component: () =>
            import('@/views/goodMother/marketTools/giftCard/ticket'),
          meta: {
            title: '领卡记录'
          }
        },
        {
          path: 'purch',
          hidden: true,
          component: () =>
            import('@/views/goodMother/marketTools/giftCard/purch'),
          meta: {
            title: '购卡记录'
          }
        }
      ]
    },
    {
      path: 'daySignature',
      name: 'portalSign',
      redirect: '/goodMother/signTools/index',
      hidden: true,
      meta: {
        title: '日签工具'
      },
      component: View,
      children: [
        {
          path: 'index',
          name: 'portalSign',
          hidden: true,
          component: () => import('@/views/goodMother/signTools/index'),
          meta: {
            icon: 'chart'
          }
        },
        {
          path: 'created/:type',
          hidden: true,
          component: () => import('@/views/goodMother/signTools/created'),
          meta: {
            title: '创建签到'
          }
        },
        {
          path: 'signInfo/:sign_id/:type',
          hidden: true,
          component: () => import('@/views/goodMother/signTools/created'),
          meta: {
            title: '修改签到'
          }
        },
        {
          path: 'comment/:sign_id',
          hidden: true,
          component: () => import('@/views/goodMother/signTools/comment'),
          meta: {
            title: '评论管理'
          }
        },
        {
          path: 'question/:sign_id',
          hidden: true,
          component: () => import('@/views/goodMother/signTools/addQuestion'),
          meta: {
            title: '添加日签题'
          }
        },
        {
          path: 'detail/:sign_id/:question_id',
          hidden: true,
          component: () =>
            import('@/views/goodMother/signTools/commentDetail'),
          meta: {
            title: '评论详情'
          }
        },
        {
          path: 'overview/:sign_id',
          hidden: true,
          component: () =>
            import('@/views/goodMother/signTools/dataOverview'),
          meta: {
            title: '数据概览'
          }
        }
      ]
    },
    {
      path: 'priceTool',
      name: 'increase',
      redirect: '/goodMother/marketTools/priceTool/index',
      hidden: true,
      meta: {
        title: '阶梯涨价工具'
      },
      component: View,
      children: [
        {
          path: 'index',
          name: 'increase',
          hidden: true,
          component: () =>
            import('@/views/goodMother/marketTools/priceTool/index'),
          meta: {
            icon: 'officialmanage'
          }
        },
        {
          path: 'news/:id',
          hidden: true,
          component: () =>
            import('@/views/goodMother/marketTools/priceTool/news'),
          meta: {
            className: 'increase',
            title: '新建礼品卡'
          }
        }
      ]
    },
    {
      path: 'coupon',
      name: 'coupon',
      redirect: '/goodMother/marketTools/coupon/index',
      hidden: true,
      meta: {
        title: '优惠券'
      },
      component: View,
      children: [
        {
          path: 'index',
          name: 'coupon',
          hidden: true,
          component: () =>
            import('@/views/goodMother/marketTools/coupon/index'),
          meta: {
            icon: 'account'
          }
        },
        {
          path: 'news/:id',
          hidden: true,
          component: () =>
            import('@/views/goodMother/marketTools/coupon/news'),
          meta: {
            className: 'coupon',
            title: '新建优惠券'
          }
        },
        {
          path: 'receive/:id',
          hidden: true,
          component: () => import('@/views/goodMother/marketTools/coupon/receive'),
          meta: { className: 'coupon' }
        }
      ]
    },
    {
      path: 'newCustomers',
      name: 'newCustomers',
      redirect: '/goodMother/marketTools/newCustomers/index',
      hidden: true,
      meta: {
        title: '新人页面',
        icon: 'counselor'
      },
      component: View,
      children: [
        {
          path: 'index',
          name: 'newCustomers',
          hidden: true,
          component: () => import('@/views/goodMother/marketTools/newCustomers/index'),
          meta: {
            icon: 'counselor'
          }
        }
      ]
    },
    {
      path: 'questionnaire',
      name: 'questionnaire',
      redirect: '/goodMother/marketTools/questionnaire/index',
      hidden: true,
      meta: { title: '调研问卷' },
      component: View,
      children: [
        {
          path: 'index',
          name: 'questionnaire',
          hidden: true,
          component: () => import('@/views/goodMother/marketTools/questionnaire/index'),
          meta: { icon: 'account' }
        },
        {
          path: 'newQuestion/:id',
          hidden: true,
          component: () => import('@/views/goodMother/marketTools/questionnaire/newQuestion'),
          meta: {
            className: 'questionnaire',
            title: '新建问卷'
          }
        },
        {
          path: 'data/:code',
          hidden: true,
          component: () => import('@/views/goodMother/marketTools/questionnaire/data')
        },
        {
          path: 'details/:id/:code',
          hidden: true,
          component: () => import('@/views/goodMother/marketTools/questionnaire/dataDetails')
        }
      ]
    },
    {
      path: 'questionnaireAuthority',
      name: 'questionnaireAuthority',
      redirect: '/goodMother/marketTools/questionnaireAuthority/index',
      hidden: true,
      meta: {
        title: '调研问卷权限管理',
        icon: 'counselor'
      },
      component: View,
      children: [
        {
          path: 'index',
          name: 'questionnaireAuthority',
          hidden: true,
          component: () => import('@/views/goodMother/marketTools/questionnaireAuthority/index'),
          meta: { icon: 'counselor' }
        }
      ]
    }
  ]
}

export default marketToolsRouter
