import Layout from '@/views/layout/Layout'
import View from '@/views/layout/View'
const tutorRouter = {
  path: '/tutor',
  name: 'tutor',
  hidden: true,
  component: Layout,
  redirect: '/tutor/index/index',
  meta: {
    title: '教研组',
    icon: 'tutor'
  },
  children: [
    {
      path: 'ageMang',
      name: 'ageMang',
      hidden: true,
      meta: { title: '年龄管理', icon: 'peoples'
      },
      component: () => import('@/views/tutor/ageMang/index')
    },
    {
      path: 'themeMang',
      name: 'themeMang',
      hidden: true,
      meta: {
        title: '主题管理',
        icon: 'peoples'
      },
      component: () => import('@/views/tutor/themeMang')
    },
    {
      path: 'relatMang',
      name: 'relatMang',
      hidden: true,
      component: View,
      meta: {
        title: '关系管理',
        icon: 'peoples'
      },
      children: [
        {
          path: 'index',
          name: 'relatMang',
          hidden: true,
          component: () => import('@/views/tutor/relatMang/index'),
          meta: { icon: 'peoples' }
        },
        {
          path: 'content/:id',
          hidden: true,
          component: () => import('@/views/tutor/relatMang/content'),
          meta: { title: '相关内容', className: 'relatMang' }
        }
      ]
    },
    {
      path: 'auditedMang',
      name: 'auditedMang',
      hidden: true,
      meta: {
        title: '待处理审核',
        icon: 'peoples'
      },
      component: () => import('@/views/tutor/auditedMang/index')
    },
    {
      path: 'answerLibrary',
      name: 'answerLibrary',
      hidden: true,
      component: View,
      meta: {
        title: '问答库',
        icon: 'answers'
      },
      children: [
        {
          path: 'index',
          name: 'answerLibrary',
          component: () => import('@/views/tutor/answerLibrary')
        },
        {
          path: 'edit/:id',
          hidden: true,
          component: () => import('@/views/tutor/answerLibrary/edit'),
          meta: {
            title: '编辑问答',
            icon: 'answers',
            className: 'answerLibrary'
          }
        }
      ]
    },
    {
      path: 'articleLibrary',
      name: 'articleLibrary',
      hidden: true,
      component: View,
      meta: {
        title: '文章库',
        icon: 'peoples'
      },
      children: [
        {
          path: 'index',
          name: 'articleLibrary',
          hidden: true,
          component: () => import('@/views/tutor/articleLibrary/index'),
          meta: {
            icon: 'article'
          }
        },
        {
          path: 'edit/:id',
          hidden: true,
          component: () => import('@/views/tutor/articleLibrary/new'),
          meta: {
            title: '编辑文章',
            className: 'articleLibrary'
          }
        }
      ]
    },
    {
      path: 'caseLibrary',
      name: 'caseLibrary',
      hidden: true,
      component: View,
      meta: {
        title: '案例库',
        icon: 'cases'
      },
      children: [
        {
          path: 'index',
          name: 'caseLibrary',
          hidden: true,
          component: () => import('@/views/tutor/caseLibrary/index'),
          meta: { icon: 'cases' }
        },
        {
          path: 'edit/:id',
          hidden: true,
          component: () => import('@/views/tutor/caseLibrary/new'),
          meta: { title: '编辑案例', className: 'caseLibrary' }
        }
      ]
    },
    {
      path: 'tutorData',
      name: 'tutorData',
      hidden: true,
      meta: { title: '我的资料', icon: 'data' },
      component: () => import('@/views/tutor/information')
    }
  ]
}

export default tutorRouter
