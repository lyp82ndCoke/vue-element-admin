import Layout from '@/views/layout/Layout'
import View from '@/views/layout/View'
const growthRouter = {
  path: '/growth',
  name: 'growth',
  redirect: '/growth/homePage/index/index',
  component: Layout,
  hidden: true,
  meta: {
    title: '无痕养育成长营',
    icon: 'component'
  },
  children: [
    {
      path: 'homePage',
      name: 'homePage',
      redirect: '/growth/homePage/index',
      hidden: true,
      meta: {
        title: '首页',
        icon: 'dashboard'
      },
      component: View,
      children: [
        {
          path: 'index',
          name: 'article',
          hidden: true,
          redirect: '/growth/homePage/index',
          component: View,
          meta: {
            icon: 'form',
            title: '文章设置'
          },
          children: [
            {
              path: 'index',
              name: 'article',
              hidden: true,
              component: () => import('@/views/growth/homePage/article/index')
            },
            {
              path: 'news/:id',
              hidden: true,
              component: () => import('@/views/growth/homePage/article/news')
            }
          ]
        },
        {
          path: 'golden',
          name: 'golden',
          hidden: true,
          redirect: '/growth/homePage/golden/index',
          component: View,
          meta: {
            icon: 'star',
            title: '金句设置'
          },
          children: [
            {
              path: 'index',
              name: 'golden',
              hidden: true,
              component: () => import('@/views/growth/homePage/golden/index')
            },
            {
              path: 'news/:id',
              hidden: true,
              component: () => import('@/views/growth/homePage/golden/news')
            }
          ]
        },
        {
          path: 'advert',
          name: 'advert',
          hidden: true,
          redirect: '/growth/homePage/advert/index',
          component: View,
          meta: { icon: 'clipboard', title: '首页广告图' },
          children: [
            {
              path: 'index',
              name: 'advert',
              hidden: true,
              component: () => import('@/views/growth/homePage/advert/index')
            },
            {
              path: 'news/:id',
              hidden: true,
              component: () => import('@/views/growth/homePage/advert/news')
            }
          ]
        },
        {
          path: 'banner',
          name: 'banner',
          hidden: true,
          redirect: '/growth/homePage/advert/index',
          component: View,
          meta: { icon: 'fullscreen', title: 'banner' },
          children: [
            {
              path: 'index',
              name: 'banner',
              hidden: true,
              component: () => import('@/views/growth/homePage/banner/index')
            },
            {
              path: 'news/:id',
              hidden: true,
              component: () => import('@/views/growth/homePage/banner/news')
            }
          ]
        }
      ]
    },
    {
      path: 'trainingCamp',
      name: 'trainingCamp',
      redirect: '/growth/trainingCamp/courseLibrary/index',
      hidden: true,
      meta: { title: '训练营', icon: 'icon' },
      component: View,
      children: [
        {
          path: 'courseLibrary',
          name: 'courseLibrary',
          hidden: true,
          component: View,
          meta: {
            icon: 'star',
            title: '课程库'
          },
          children: [
            {
              path: 'index',
              name: 'courseLibrary',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/courseLibrary/index')
            },
            {
              path: 'newCourse/:Courseid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/courseLibrary/newCourse')
            }
          ]
        },
        {
          path: 'courseColumn',
          name: 'courseColumn',
          hidden: true,
          component: View,
          meta: {
            title: '课程专栏',
            icon: 'component'
          },
          children: [
            {
              path: 'index',
              name: 'courseColumn',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/courseColumn/index')
            },
            {
              path: 'newColumn/:Columnid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/courseColumn/newColumn')
            },
            {
              path: 'allCourse/:Columnid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/courseColumn/allCourse')
            },
            {
              path: 'newCourse/:Courseid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/courseColumn/newCourse')
            }
          ]
        },
        {
          path: 'createTraning',
          name: 'createTraning',
          hidden: true,
          component: View,
          meta: {
            title: '创建训练营',
            icon: 'size'
          },
          children: [
            {
              path: 'index',
              name: 'createTraning',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/createTraning/index')
            },
            {
              path: 'allCamp/:Campid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/createTraning/allCamp')
            },
            {
              path: 'courseColumn/:Campid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/createTraning/courseColumn')
            },
            {
              path: 'newCamp/:Campid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/createTraning/newCamp')
            },
            {
              path: 'allCourse/:Courseid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/createTraning/allCourse')
            },
            {
              path: 'taskManagement/:Campid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/createTraning/taskManagement')
            },
            {
              path: 'evaluation/:Campid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/createTraning/evaluation')
            }
          ]
        },
        {
          path: 'addendManage',
          name: 'addendManage',
          hidden: true,
          component: View,
          meta: {
            title: '签到管理',
            icon: 'edit'
          },
          children: [
            {
              path: 'index',
              name: 'addendManage',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/addendManage/index')
            },
            {
              path: 'depositList/:Signid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/addendManage/depositList')
              // meta: {
              //   title: '签到管理',
              //   icon: 'edit'
              // },
            },
            {
              path: 'itemBank/:Signid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/addendManage/itemBank')
            },
            {
              path: 'newAddend/:Addendid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/addendManage/newAddend')
            },
            {
              path: 'userInfo/:Signid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/addendManage/userInfo')
            }
          ]
        },
        {
          path: 'allTraining',
          name: 'allTraining',
          hidden: true,
          component: View,
          meta: {
            title: '全部训练营',
            icon: 'example'
          },
          children: [
            {
              path: 'index',
              name: 'allTraining',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/allTraining/index')
            },
            {
              path: 'newCamp/:Campid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/allTraining/newCamp')
            }
          ]
        },
        {
          path: 'taskLibrary',
          name: 'taskLibrary',
          hidden: true,
          component: () => import('@/views/growth/trainingCamp/taskLibrary/index'),
          meta: {
            title: '任务库',
            icon: 'list'
          }
        },
        {
          path: 'taskManage',
          name: 'taskManage',
          hidden: true,
          component: View,
          meta: {
            title: '任务管理',
            icon: 'table'
          },
          children: [
            {
              path: 'index',
              name: 'taskManage',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/taskManage/index')
            },
            {
              path: 'viewDetails/:id',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/taskManage/viewDetails')
            },
            {
              path: 'statistics',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/taskManage/statistics')
            },
            {
              path: 'comment/:id',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/taskManage/commentList')
            },
            {
              path: 'deposit/:id',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/taskManage/depositList')
            }
          ]
        },
        {
          path: 'evaluationManagement',
          name: 'evaluationManagement',
          hidden: true,
          component: View,
          meta: {
            title: '测评试卷管理',
            icon: 'documentation'
          },
          children: [
            {
              path: 'index',
              name: 'evaluationManagement',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/evaluationManagement/index')
            },
            {
              path: 'checkPaper/:Paperid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/evaluationManagement/checkPaper')
            }
          ]
        },
        {
          path: 'competitionManagement',
          name: 'competitionManagement',
          hidden: true,
          component: View,
          meta: {
            title: '赛区管理',
            icon: 'international'
          },
          children: [
            {
              path: 'index',
              name: 'competitionManagement',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/competitionManagement/index')
            },
            {
              path: 'newComp/:compid',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/competitionManagement/newComp')
            },
            {
              path: 'rankingList',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/competitionManagement/rankingList')
            }
          ]
        },
        {
          path: 'advertisementManagement',
          name: 'advertisementManagement',
          hidden: true,
          component: View,
          meta: {
            title: '广告管理',
            icon: 'cases'
          },
          children: [
            {
              path: 'index',
              name: 'advertisementManagement',
              hidden: true,
              component: () => import('@/views/growth/trainingCamp/advertisementManagement/index')
            }
          ]
        }
      ]
    },
    {
      path: 'commentManage',
      name: 'commentManage',
      hidden: true,
      component: () => import('@/views/growth/commentManage/index'),
      meta: {
        title: '评论管理',
        icon: 'language'
      }
    },
    {
      path: 'member-growthWall',
      name: 'member-growthWall',
      hidden: true,
      component: () => import('@/views/growth/growthWall/index'),
      meta: {
        title: '成长墙',
        icon: 'chart'
      }
    },
    {
      path: 'member-help',
      name: 'member-help',
      hidden: true,
      meta: { title: '使用帮助', icon: 'guide' },
      component: () => import('@/views/growth/userHelp/index')
    },
    {
      path: 'member-manage',
      name: 'member-manage',
      hidden: true,
      meta: { title: '用户管理', icon: 'component' },
      component: () => import('@/views/growth/userManage/index')
    }
  ]
}
export default growthRouter
