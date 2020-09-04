import Layout from '@/views/layout/Layout'
import View from '@/views/layout/View'
const goodMotherRouter = {
  path: '/goodMother',
  name: 'goodMother',
  redirect: '/goodMother/peopleManage/index',
  component: Layout,
  hidden: true,
  meta: { title: '好妈妈代言人', icon: 'official' },
  children: [
    {
      path: 'peopleManage',
      name: 'peopleManage',
      redirect: '/goodMother/peopleManage/index',
      hidden: true,
      component: View,
      children: [
        {
          path: 'index',
          name: 'peopleManage',
          hidden: true,
          component: () => import('@/views/goodMother/peopleManage/index'),
          meta: { icon: 'officialmanage',
            title: '代言人管理'
          }
        },
        {
          path: 'heartScore/:id',
          hidden: true,
          component: () => import('@/views/goodMother/peopleManage/heartScore')
        },
        {
          path: 'promotionNum/:id',
          hidden: true,
          component: () => import('@/views/goodMother/peopleManage/promotionNum')
        }
      ]
    },
    {
      path: 'ruleConfig',
      name: 'ruleConfig',
      hidden: true,
      meta: { title: '规则配置', icon: 'data' },
      component: () => import('@/views/goodMother/ruleConfig/index')
    },
    {
      path: 'goodsRules/:id',
      hidden: true,
      meta: { title: '规则配置', icon: 'data' },
      component: () => import('@/views/goodMother/ruleConfig/goodsRules')
    },
    {
      path: 'cardRules/:id',
      hidden: true,
      meta: { title: '规则配置', icon: 'data' },
      component: () => import('@/views/goodMother/ruleConfig/cardRules')
    },
    {
      path: 'levelConfig',
      name: 'levelConfig',
      hidden: true,
      meta: { title: '等级配置', icon: 'international' },
      component: () => import('@/views/goodMother/levelConfig/index')
    }
    // {
    //   path: 'distribution',
    //   name: 'distribution',
    //   hidden: true,
    //   meta: {
    //     title: '分销商品管理',
    //     icon: 'tree'
    //   },
    //   component: () => import('@/views/goodMother/distribution/index')
    // },
    // {
    //   path: 'cashManage',
    //   name: 'cashManage',
    //   hidden: true,
    //   meta: {
    //     title: '提现管理',
    //     icon: 'money'
    //   },
    //   component: () => import('@/views/goodMother/cashManage/index')
    // },
  ]
}

export default goodMotherRouter
