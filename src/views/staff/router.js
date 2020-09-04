import Layout from '@/views/layout/Layout'
import View from '@/views/layout/View'
const staffRouter = {
  path: '/staff',
  name: 'staff',
  hidden: true,
  component: Layout,
  redirect: '/staff/index/index',
  meta: { title: '账号管理', icon: 'peoples' },
  children: [
    {
      path: 'index',
      name: 'stafflist',
      hidden: true,
      component: View,
      meta: { title: '员工账号', icon: 'staff' },
      children: [
        {
          path: 'index',
          hidden: true,
          name: 'stafflist',
          component: () => import('@/views/staff/list')
        },
        {
          path: 'news/:id',
          hidden: true,
          component: () => import('@/views/staff/list/news'),
          meta: { title: '新建账户', icon: 'peoples', className: 'stafflist' }
        }
      ]
    },
    {
      path: 'permission',
      name: 'permission',
      hidden: true,
      component: View,
      meta: { title: '角色管理', icon: 'permission' },
      children: [
        {
          path: 'index',
          hidden: true,
          name: 'permission',
          component: () => import('@/views/staff/permission/index')
        },
        {
          path: 'news/:id',
          hidden: true,
          component: () => import('@/views/staff/permission/news'),
          meta: { title: '新建账户', icon: 'permission', className: 'permission' }
        }
      ]
    }
  ]
}

export default staffRouter
