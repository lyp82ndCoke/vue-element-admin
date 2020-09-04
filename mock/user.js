import {
  param2Obj
} from './utils'

import Mock from 'mockjs'
const tokens = {
  admin: {
    token: 'admin',
    permission: ['example', 'table', 'tree'],
    access_token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJ6aGltYXdlbmh1YSIsImlhdCI6MTU1NTQ4MDE0NSwiZGF0YSI6eyJ1c2VyX2lkIjoxfSwic2NvcGVzIjoicm9sZV9hY2Nlc3MiLCJleHAiOjE1NTU5MTIxNDV9.RXG4nnsM2rP5vGZH4FgZ-i49vRbnaZ7iESgbbmShzCY',
    token_type: 'bearer',
    express_time: 1555912145
  },
  editor: {
    token: 'editor'
  }
}
// 菜单权限list
let list = [{
    id: 'group',
    name: '商城',
    children: [{
        id: 'h5-goods',
        name: '商品管理'
      },
      {
        id: 'micropage',
        name: '微页面'
      },
      {
        id: 'groupqrcode',
        name: '二维码管理'
      },
      {
        id: 'groupmanage',
        name: '库存管理'
      },
      {
        id: 'grouporder',
        name: '订单管理'
      },
      {
        id: 'wechatGroup',
        name: '微信群管理'
      }
    ]
  },
  {
    id: 'trainCamp',
    name: '训练营(群)',
    children: [{
        id: 'camp-goods',
        name: '训练营商品管理',
      },
      {
        id: 'trainstock',
        name: '库存管理'
      },
      {
        id: 'trainqrcode',
        name: '二维码管理'
      },
      {
        id: 'trainorder',
        name: '订单管理'
      }
    ]
  },
  {
    id: 'growth',
    name: '无痕养育成长营',
    children: [{
        id: 'homePage',
        name: '首页',
        children: [{
            id: 'article',
            name: '文章设置'
          },
          {
            id: 'golden',
            name: '金句设置'
          },
          {
            id: 'advert',
            name: '首页广告图'
          },
          {
            id: 'banner',
            name: 'banner'
          }
        ]
      },
      {
        id: 'trainingCamp',
        name: '训练营',
        children: [{
            id: 'courseLibrary',
            name: '课程库'
          },
          {
            id: 'courseColumn',
            name: '课程专栏'
          },
          {
            id: 'createTraning',
            name: '创建训练营'
          },
          {
            id: 'addendManage',
            name: '签到管理'
          },
          {
            id: 'allTraining',
            name: '全部训练营'
          },
          {
            id: 'taskLibrary',
            name: '任务库'
          },
          {
            id: 'taskManage',
            name: '任务管理'
          },
          {
            id: 'evaluationManagement',
            name: '测评试卷管理'
          },
          {
            id: 'competitionManagement',
            name: '赛区管理'
          },
          {
            id: 'advertisementManagement',
            name: '广告管理'
          },
        ]
      },
      {
        id: 'commentManage',
        name: '评论管理'
      },
      {
        id: 'member-growthWall',
        name: '成长墙'
      },
      {
        id: 'member-help',
        name: '使用帮助'
      },
      {
        id: 'member-manage',
        name: '用户管理'
      }
    ]
  },
  {
    id: 'goodMother',
    name: '好妈妈代言人',
    children: [{
        id: 'peopleManage',
        name: '代言人管理'
      },
      {
        id: 'ruleConfig',
        name: '规则配置'
      },
      {
        id: 'levelConfig',
        name: '等级配置'
      },
      {
        id: 'distribution',
        name: '分销商品管理'
      },
      {
        id: 'cashManage',
        name: '提现管理'
      }
    ]
  },
  {
    id: 'marketTools',
    name: '营销工具',
    children: [{
        id: 'giftCard',
        name: '礼品卡'
      },
      {
        id: 'increase',
        name: '阶梯涨价工具'
      },
      {
        id: 'coupon',
        name: '优惠券'
      },
      {
        id: 'newCustomers',
        name: '新人页面'
      },
      {
        id: 'questionnaire',
        name: '调研问卷'
      },
      {
        id: 'questionnaireAuthority',
        name: '调研问卷权限管理'
      }
    ]
  },
  {
    id: 'public',
    name: '公共资源',
    children: [{
        id: 'public-goods',
        name: '商品管理'
      },
      {
        id: 'public-qrcode',
        name: '二维码管理'
      }
    ]
  },
  {
    id: 'drainage',
    name: '订阅号活动',
    children: [{
        id: 'officialAccount',
        name: '公众号管理'
      },
      {
        id: 'activity',
        name: '活动管理'
      },
      {
        id: 'media',
        name: '素材管理'
      },
      {
        id: 'goods',
        name: '商品管理'
      }
    ]
  },
  {
    id: 'counselor',
    name: '辅导员赋能',
    children: [{
        id: 'counselorSchedule',
        name: '我的排班'
      },
      {
        id: 'counselorAnswers',
        name: '我的问答库'
      },
      {
        id: 'counselorCases',
        name: '我的案例库'
      },
      {
        id: 'counselorIntegral',
        name: '我的贡献值'
      },
      {
        id: 'counselorData',

        name: '我的资料'
      }
    ]
  },
  {
    id: 'socialNetwork',
    name: '社会化网络',
    children: [{
        id: 'counselorMang',
        name: '辅导员管理'
      },
      {
        id: 'counselorStatus',
        name: '辅导员排班状态查询'
      },
      {
        id: 'scheduMang',
        name: '排班管理'
      },
      {
        id: 'integralMang',
        name: '贡献值管理'
      },
      {
        id: 'counselorRanking',
        name: '排行榜查询'
      }
    ]
  },
  {
    id: 'teachMang',
    name: '教研管理'
  },
  {
    id: 'tutor',
    name: '教研组',
    children: [{
        id: 'ageMang',
        name: '年龄管理'
      },
      {
        id: 'themeMang',
        name: '主题管理'
      },
      {
        id: 'relatMang',
        name: '关系管理'
      },
      {
        id: 'auditedMang',
        name: '待审核处理'
      },
      {
        id: 'answerLibrary',
        name: '问答库'
      },
      {
        id: 'articleLibrary',
        name: '文章库'
      },
      {
        id: 'caseLibrary',
        name: '案例库'
      },
      {
        id: 'tutorData',
        name: '我的资料'
      }
    ]
  },
  {
    id: 'projectManager',
    name: '项目经理',
    children: [{
        id: 'projectMang',
        name: '项目经理管理'
      },
      {
        id: 'projectAudit',
        name: '待处理审核'
      },
      {
        id: 'projectLeader',
        name: '项目负责人管理'
      },
      {
        id: 'projectInfo',
        name: '我的资料'
      }
    ]
  },
  {
    id: 'stafflist',
    name: '员工账号',
    children: [{
        id: 'stafflist',
        name: '员工账号'
      },
      {
        id: 'permission',
        name: '角色管理'
      }
    ]
  }
]

const users = {
  admin: {
    'rule_name|1': [
      [
        'officialAccount',
        'drainage',
        'goods',
        'activity',
        'media',
        'staff',
        'stafflist',
        'growth',
        'homePage',
        'article',
        'golden',
        'advert',
        'banner',
        'trainingCamp',
        'courseLibrary',
        'courseColumn',
        'createTraning',
        'addendManage',
        'allTraining',
        'taskLibrary',
        'taskManage',
        'evaluationManagement',
        'competitionManagement',
        'advertisementManagement',
        'commentManage',
        'growthCamp',
        'campMaterial',
        'campCourse',
        'permission',
        'permissionlist',
        'counselor',
        'counselorSchedule',
        'counselorAnswers',
        'counselorArticles',
        'counselorCases',
        'counselorData',
        'socialNetwork',
        'counselorMang',
        'counselorStatus',
        'integralMang',
        'counselorRanking',
        'tutor',
        'ageMang',
        'themeMang',
        'articleLibrary',
        'answerLibrary',
        'caseLibrary',
        'counselorIntegral',
        'scheduMang',
        'teachMang',
        'relatMang',
        'auditedMang',
        'tutorData',
        'group',
        'h5-goods',
        'micropage',
        'groupqrcode',
        'groupmanage',
        'grouporder',
        'wechatGroup',
        'trainCamp',
        'camp-goods',
        'trainstock',
        'trainqrcode',
        'trainorder',
        'projectManager',
        'projectMang',
        'projectAudit',
        'projectLeader',
        'projectInfo',
        'member',
        'member-stock',
        'member-order',
        'groupsManage',
        'member-goods',
        'demandManage',
        'member-demand',
        'member-asking',
        'member-growthWall',
        'member-article',
        'member-manage',
        'member-help',
        'public',
        'public-goods',
        'public-qrcode',
        'goodMother',
        'peopleManage',
        'ruleConfig',
        'levelConfig',
        'distribution',
        'cashManage',
        'marketTools',
        'giftCard',
        "increase",
        "coupon",
        "newCustomers",
        "questionnaire",
        "questionnaireAuthority"
      ]
    ],
    name: '@cname',
    avatar: 'https://poster-share.oss-cn-beijing.aliyuncs.com/poster/ZMWH57A79A8763A4C886435A198270E51079.jpeg'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

export default {
  login: res => {
    // console.log('res.body',res.body)
    const {
      username
    } = JSON.parse(res.body)
    console.log('进入登录', JSON.parse(res.body))
    const result = tokens['admin']
    // console.log('进入登录',result)
    if (result) {
      return {
        code: 200,
        result
      }
    }
    return {
      code: 60204,
      message: 'Account and password are incorrect.'
    }
  },
  getInfo: res => {
    console.log('getInfo:', res)
    const {
      token
    } = param2Obj(res.url)
    const info = users['admin']
    if (info) {
      let result = Mock.mock(info)
      // console.log('info:',info)
      return {
        code: 200,
        result
      }
    }
    return {
      code: 50008,
      message: 'Login failed, unable to get user details.'
    }
  },
  logout: () => {
    return {
      code: 200,
      result: 'success'
    }
  }
}
