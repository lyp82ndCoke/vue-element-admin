import Layout from '@/views/layout/Layout'
import View from '@/views/layout/View'
const counselorRouter = {
  path: '/counselor',
  name: 'counselor',
  hidden: true,
  component: Layout,
  redirect: '/counselor/counselorSchedule',
  meta: {
    title: '辅导员赋能',
    icon: 'counselor'
  },
  children: [
    // {
    //   path: 'counselorSchedule',
    //   name: 'counselorSchedule',
    //   hidden: true,
    //   component: View,
    //   meta: {
    //     title: '我的排班',
    //     icon: 'schedule'
    //   },
    //   component: () => import('@/views/counselor/schedule')
    // },
    // {
    //   path: 'counselorAnswers',
    //   name: 'counselorAnswers',
    //   hidden: true,
    //   component: View,
    //   meta: {
    //     title: '我的问答库',
    //     icon: 'answers'
    //   },
    //   component: View,

    //   children: [{
    //       path: 'index',
    //       name: 'counselorAnswers',
    //       component: () => import('@/views/counselor/answers')
    //     },
    //     {
    //       path: 'news/:id',
    //       hidden: true,
    //       component: () => import('@/views/counselor/answers/news'),
    //       meta: {
    //         title: '新建问答',
    //         icon: 'answers',
    //         className: 'counselorAnswers'
    //       }
    //     }
    //   ]
    // },
    {
      path: 'counselorCases',
      name: 'counselorCases',
      hidden: true,
      component: View,
      meta: {
        title: '我的案例库',
        icon: 'cases'
      },
      children: [
        {
          path: 'index',
          name: 'counselorCases',
          hidden: true,
          component: () => import('@/views/counselor/cases/index'),
          meta: {
            icon: 'cases'
          }
        },
        {
          path: 'add/:id',
          hidden: true,
          component: () => import('@/views/counselor/cases/new'),
          meta: {
            title: '添加案例',
            className: 'counselorCases'
          }
        }
      ]
    },
    // {
    //   path: 'counselorIntegral',
    //   name: 'counselorIntegral',
    //   hidden: true,
    //   component: View,
    //   meta: {
    //     title: '我的贡献值',
    //     icon: 'integral'
    //   },
    //   component: () => import('@/views/counselor/integral')
    // },
    {
      path: 'counselorData',
      name: 'counselorData',
      hidden: true,
      meta: {
        title: '我的资料',
        icon: 'data'
      },
      component: () => import('@/views/counselor/information')
    }
  ]
}

export default counselorRouter
