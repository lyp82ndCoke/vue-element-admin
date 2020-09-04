import Mock from 'mockjs'

export default {
  list: () => {
    const items = Mock.mock([
      {
        path: '/login',
        component: () => import('@/views/login/index'),
        hidden: true
      },
      {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
      },
      {
        path: '/',
        component: () => import('@/views/layout/Layout'),
        redirect: '/home',
        name: 'home',
        hidden: true,
        meta: {
          title: '主页'
        },
        children: [
          {
            path: 'home',
            component: () => import('@/views/home/index')
          }
        ]
      },
      {
        path: '/drainage',
        name: 'drainage',
        redirect: '/drainage/officialAccount',
        component:  () => import('@/views/layout/Layout'),
        hidden: true,
        meta: {
          title: '订阅号活动',
          icon: 'people'
        },
        children: [
          {
            path: 'officialAccount',
            name: 'officialAccount',
            hidden: true,
            component: () => import('@/views/activity/official/index'),
            meta: {
              title: '公众号管理',
              icon: 'people'
            }
          },
          {
            path: 'activity',
            name: 'activity',
            redirect: '/drainage/activity/index/index',
            hidden: true,
            meta: {
              title: '活动管理',
              icon: 'people'
            },
            component:  () => import('@/views/layout/View'),
            children: [
              {
                path: 'index',
                name: 'activity',
                hidden: true,
                component: () => import('@/views/activity/home'),
                meta: {
                  icon: 'people'
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
            ]
          },
  
          {
            path: 'media',
            name: 'media',
            hidden: true,
            component: () => import('@/views/activity/index'),
            meta: {
              title: '素材管理',
              icon: 'people'
            },
            children: [
              {
                path: 'index',
                name: 'activity',
                hidden: true,
                component: () => import('@/views/activity/source/index'),
                meta: {
                  icon: 'people'
                }
              },
              {
                path: 'source/:id',
                hidden: true,
                component: () => import('@/views/activity/material/index'),
                meta: {
                  title: '新建素材',
                  icon: 'setting',
                  className: 'activity'
                }
              }
            ]
          },
          {
            path: 'goods',
            name: 'goods',
            hidden: true,
            component: () => import('@/views/activity/index'),
            meta: {
              title: '商品管理',
              icon: 'people'
            },
            children: [
              {
                path: 'index',
                name: 'activity',
                hidden: true,
                component: () => import('@/views/table/index'),
                meta: {
                  icon: 'people'
                }
              },
              {
                path: 'goods/:id',
                hidden: true,
                component: () => import('@/views/activity/goods/index'),
                meta: {
                  title: '新建商品',
                  icon: 'setting',
                  className: 'activity'
                }
              }
            ]
          }
        ]
      },
      {
        path: '/staff',
        name: 'staff',
        hidden: true,
        component:  () => import('@/views/layout/Layout'),
        redirect: 'index',
        meta: {
          title: '账号管理',
          icon: 'peoples'
        },
        children: [
          {
            path: 'index',
            name: 'stafflist',
            hidden: true,
            component:  () => import('@/views/layout/View'),
            meta: {
              title: '员工账号',
              icon: 'peoples'
            },
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
                meta: {
                  title: '新建账户',
                  icon: 'peoples',
                  className: 'stafflist'
                }
              }
            ]
          },
          {
            path: 'permission',
            name: 'permission',
            hidden: true,
            component:  () => import('@/views/layout/View'),
            meta: {
              title: '角色管理',
              icon: 'peoples'
            },
            children: [
              {
                path: 'index',
                hidden: true,
                name: 'permissionlist',
                component: () => import('@/views/staff/permission/index')
              },
              {
                path: 'news/:id',
                hidden: true,
                component: () => import('@/views/staff/permission/news'),
                meta: {
                  title: '新建账户',
                  icon: 'peoples',
                  className: 'permission'
                }
              }
            ]
          }
        ]
      },
  
      {
        path: '*',
        redirect: '/404',
        hidden: true
      }
    ])
    return {
      code: 200,
      data: items
    }
  }
}
