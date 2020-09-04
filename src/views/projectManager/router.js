import Layout from '@/views/layout/Layout'
import View from '@/views/layout/View'
const projectManagerRouter = {
  path: '/projectManager',
  name: 'projectManager',
  hidden: true,
  component: Layout,
  redirect: '/projectManager/projectMang/index',
  meta: {
    title: '项目经理',
    icon: 'network'
  },
  children: [
    {
      path: 'projectMang',
      name: 'projectMang',
      hidden: true,
      component: View,
      meta: { title: '项目经理管理', icon: 'teachMang' },
      children: [
        {
          path: 'index',
          name: 'projectMang',
          hidden: true,
          component: () => import('@/views/projectManager/projectMang/index'),
          meta: { icon: 'answers' }
        },
        {
          path: 'add/:id',
          hidden: true,
          component: () => import('@/views/projectManager/projectMang/new'),
          meta: { title: '添加项目经理', className: 'projectMang' }
        }
      ]
    },
    {
      path: 'projectAudit',
      name: 'projectAudit',
      hidden: true,
      component: View,
      meta: { title: '待处理审核', icon: 'peoples' },
      children: [
        {
          path: 'index',
          name: 'projectAudit',
          hidden: true,
          component: () => import('@/views/projectManager/projectAudit/index'),
          meta: { icon: 'answers' }
        },
        {
          path: 'add/:id',
          hidden: true,
          component: () => import('@/views/projectManager/projectAudit/new'),
          meta: { title: '案例采纳', className: 'projectAudit' }
        }
      ]
    },
    // {
    //   path: 'projectAudit',
    //   name: 'projectAudit',
    //   hidden: true,
    //   component: View,
    //   meta: {
    //     title: '待处理审核',
    //     icon: 'peoples'
    //   },
    //   component: () => import('@/views/projectManager/projectAudit')
    // },
    {
      path: 'projectLeader',
      name: 'projectLeader',
      hidden: true,
      meta: { title: '项目负责人管理', icon: 'answers' },
      component: () => import('@/views/projectManager/projectLeader')
    },
    {
      path: 'projectInfo',
      name: 'projectInfo',
      hidden: true,
      meta: { title: '我的资料', icon: 'data' },
      component: () => import('@/views/projectManager/projectInfo')
    }
  ]
}

export default projectManagerRouter
