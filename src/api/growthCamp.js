//无痕养育成长营模块所有接口
import request from '@/utils/request'


// 重构无痕养育成长营

// 课程库
// 课程库-添加课程
export function addCourse(data) {
  return request({
    url: '/edu/Course/addCourse',
    method: 'post',
    data
  })
}

// 课程库-修改课程
export function updateCourse(data) {
  return request({
    url: '/edu/Course/updateCourse',
    method: 'post',
    data
  })
}

// 课程库-删除课程
export function delCourse(data) {
  return request({
    url: '/edu/Course/delCourse',
    method: 'post',
    data
  })
}
// 课程库-课程列表
export function courseList(data) {
  return request({
    url: '/edu/Course/courseList',
    method: 'post',
    data
  })
}

// 课程库-课程详情
export function courseDetails(data) {
  return request({
    url: '/edu/Course/courseDetails',
    method: 'post',
    data
  })
}


// 课程专栏
// 课程专栏-添加专栏
export function addSpecColumn(data) {
  return request({
    url: '/edu/Column/addSpecColumn',
    method: 'post',
    data
  })
}
// 课程专栏-修改专栏
export function updateSpecColumn(data) {
  return request({
    url: '/edu/Column/updateSpecColumn',
    method: 'post',
    data
  })
}
// // 课程专栏-课程详情
// export function courseDetails(data) {
//   return request({
//     url: '/edu/Course/courseDetails',
//     method: 'post',
//     data
//   })
// }

// 课程专栏-删除专栏
export function delSpecColumn(data) {
  return request({
    url: '/edu/Column/delSpecColumn',
    method: 'post',
    data
  })
}
// 课程专栏-专栏列表
export function specColumnList(data) {
  return request({
    url: '/edu/Column/specColumnList',
    method: 'post',
    data
  })
}
// 课程专栏-专栏列表内查看课程
export function specColumnCourseList(data) {
  return request({
    url: '/edu/Column/specColumnCourseList',
    method: 'post',
    data
  })
}
// 课程专栏-专栏内绑定课程
export function bindSpecColumnCourse(data) {
  return request({
    url: '/edu/Column/bindSpecColumnCourse',
    method: 'post',
    data
  })
}
// 课程专栏-删除专栏与课程关系
export function delSpecColumnCourse(data) {
  return request({
    url: '/edu/Column/delSpecColumnCourse',
    method: 'post',
    data
  })
}
// 课程专栏-获取课程专栏详情
export function specColumnDetails(data) {
  return request({
    url: '/edu/Column/specColumnDetails',
    method: 'post',
    data
  })
}


// 训练营
// 训练营-添加训练营
// //获取训练营列表
export function campList(params) {
  return request({
    url: '/edu/Camp/campList',
    method: 'get',
    params
  })
}
// 训练营-添加训练营
export function addCamp(data) {
  return request({
    url: '/edu/Camp/addCamp',
    method: 'post',
    data
  })
}
// 训练营-编辑训练营
export function editCamp(data) {
  return request({
    url: '/edu/Camp/editCamp',
    method: 'post',
    data
  })
}
// 训练营-删除训练营
export function delCamp(data) {
  return request({
    url: '/edu/Camp/delCamp',
    method: 'post',
    data
  })
}
// 训练营-营期列表
export function campTimesList(data) {
  return request({
    url: '/edu/Camptimes/campTimesList',
    method: 'post',
    data
  })
}
// 训练营-添加训练营营期
export function addCampTimes(data) {
  return request({
    url: '/edu/Camptimes/addCampTimes',
    method: 'post',
    data
  })
}

// 训练营-编辑训练营期
export function updateCampTimes(data) {
  return request({
    url: '/edu/Camptimes/updateCampTimes',
    method: 'post',
    data
  })
}
// 训练营-获取训练营期详情
export function campTimesDetails(data) {
  return request({
    url: '/edu/Camptimes/campTimesDetails',
    method: 'post',
    data
  })
}
// 训练营-删除训练营期
export function delCampTimes(data) {
  return request({
    url: '/edu/Camptimes/delCampTimes',
    method: 'post',
    data
  })
}
// 训练营-营期内用户列表
export function campTimesUserList(data) {
  return request({
    url: '/edu/Camptimes/campTimesUserList',
    method: 'post',
    data
  })
}
// 训练营-删除训练营期内用户
export function delCampTimesUser(data) {
  return request({
    url: '/edu/Camptimes/delCampTimesUser',
    method: 'post',
    data
  })
}
// 训练营-营期内课程列表
export function campTimesCourseList(data) {
  return request({
    url: '/edu/Camptimes/campTimesCourseList',
    method: 'post',
    data
  })
}
// 训练营-删除训练营期内课程
export function delCampTimesCourse(data) {
  return request({
    url: '/edu/Camptimes/delCampTimesCourse',
    method: 'post',
    data
  })
}
// 训练营-训练营期内绑定课程
export function bindCampTimesColumnCourse(data) {
  return request({
    url: '/edu/Camptimes/bindCampTimesColumnCourse',
    method: 'post',
    data
  })
}

// 训练营-训练营期内编辑课程
export function editCampTimesCourse(data) {
  return request({
    url: '/edu/Camptimes/editCampTimesCourse',
    method: 'post',
    data
  })
}

// 训练营-训练营期内绑定商品规格查询明细
export function getItemInfo(data) {
  return request({
    url: '/edu/Camptimes/getItemInfo',
    method: 'post',
    data
  })
}

//创建训练营-营期内新增绑定多个专栏
// 获取营期内多个专栏列表
export function getCampTimesSpecColumnList(data) {
  return request({
    url: '/edu/spec_column/getCampTimesSpecColumnList',
    method: 'post',
    data
  })
}

// 营期内添加专栏
export function addCampTimesSpecColumn(data) {
  return request({
    url: '/edu/spec_column/addCampTimesSpecColumn',
    method: 'post',
    data
  })
}

// 营期内删除专栏
export function delCampTimesColumn(data) {
  return request({
    url: '/edu/Camptimes/deleteCampTimesColumn',
    method: 'post',
    data
  })
}

// 获取营期内某个专栏的课程列表
export function getCampTimesSpecColumnCourseList(data) {
  return request({
    url: '/edu/spec_column/getCampTimesSpecColumnCourseList',
    method: 'post',
    data
  })
}





// 创建训练营绑定任务
// 配置任务规则
export function insertTimesTask(data) {
  return request({
    url: '/edu/times_task/insertTimesTask',
    method: 'post',
    data
  })
}

// 任务列表
export function taskLibraryList(data) {
  return request({
    url: '/edu/task_library/taskLibraryList',
    method: 'post',
    data
  })
}

// 营期添加任务内容
export function insertTimesTaskContent(data) {
  return request({
    url: '/edu/times_task/insertTimesTaskContent',
    method: 'post',
    data
  })
}

// 修改营期任务
export function updateTimesTask(data) {
  return request({
    url: '/edu/times_task/updateTimesTask',
    method: 'post',
    data
  })
}

// 获取营期任务详情
export function getTimesTaskData(data) {
  return request({
    url: '/edu/times_task/getTimesTask',
    method: 'post',
    data
  })
}

// 查询营期任务配置的任务列表
export function getTaskContentList(data) {
  return request({
    url: '/edu/times_task/getTimesTaskContentList',
    method: 'post',
    data
  })
}

// 查询营期任务配置的任务列表
export function getTaskContentExplameList(data) {
  return request({
    url: '/edu/times_task/getTimesTaskContentExampleList',
    method: 'post',
    data
  })
}

// 任务分类列表
export function getTaskCategroyList(data) {
  return request({
    url: '/edu/times_task/getTaskCategroyList',
    method: 'post',
    data
  })
}

// 用户明细列表
export function TaskUserCompleted(data) {
  return request({
    url: '/edu/times_task/TaskUserCompleted',
    method: 'post',
    data
  })
}

// 管理后台小任务改版新增赛区管理
//赛区列表
export function getMatchList(data) {
  return request({
    url: '/edu/match/getMatchList',
    method: 'post',
    data
  })
}

//新增赛区
export function insertMatch(data) {
  return request({
    url: '/edu/match/insertMatch',
    method: 'post',
    data
  })
}

//编辑赛区
export function updateMatch(data) {
  return request({
    url: '/edu/match/updateMatch',
    method: 'post',
    data
  })
}

//获取赛区详情
export function getMatch(data) {
  return request({
    url: '/edu/match/getMatch',
    method: 'post',
    data
  })
}

//赛区隐藏
export function matchSetShow(data) {
  return request({
    url: '/edu/match/matchSetShow',
    method: 'post',
    data
  })
}

//赛区置顶
export function matchSetTop(data) {
  return request({
    url: '/edu/match/matchSetTop',
    method: 'post',
    data
  })
}

//广告管理部分
//广告列表页
export function getAdvList(data) {
  return request({
    url: '/edu/adv/getAdvList',
    method: 'post',
    data
  })
}

//广告上下架
export function advSetUse(data) {
  return request({
    url: '/edu/adv/advSetUse',
    method: 'post',
    data
  })
}

//新增广告
export function insertAdv(data) {
  return request({
    url: '/edu/adv/insertAdv',
    method: 'post',
    data
  })
}

//修改广告
export function updateAdv(data) {
  return request({
    url: '/edu/adv/updateAdv',
    method: 'post',
    data
  })
}

//获取广告详情
export function getAdv(data) {
  return request({
    url: '/edu/adv/getAdv',
    method: 'post',
    data
  })
}

//广告位置列表
export function getSiteList(data) {
  return request({
    url: '/edu/adv/getSiteList',
    method: 'post',
    data
  })
}


// 新家长必修课后台测评
// 新建测评
export function addAsses(data) {
  return request({
    url: '/edu/times_assess/addAssess',
    method: 'post',
    data
  })
}
// 获取测评详情
export function findAssessInfo(data) {
  return request({
    url: '/edu/times_assess/findAssessInfo',
    method: 'post',
    data
  })
}
// 编辑保存测评
export function updateAssess(data) {
  return request({
    url: '/edu/times_assess/updateAssess',
    method: 'post',
    data
  })
}


// 测评试卷详情
// excel导入试卷
export function importPaper(data) {
  return request({
    url: '/edu/paper/importPaper',
    method: 'post',
    data
  })
}
// 获取试卷列表
export function getPaperList(data) {
  return request({
    url: '/edu/paper/getPaperList',
    method: 'post',
    data
  })
}
// 删除试卷
export function delPaper(data) {
  return request({
    url: '/edu/paper/deletePaper',
    method: 'post',
    data
  })
}
// 获取试卷详情
export function getPaper(data) {
  return request({
    url: '/edu/paper/getPaper',
    method: 'post',
    data
  })
}






// 签到管理
// 签到列表
export function getSignList(data) {
  return request({
    url: '/edu/Sign/getSignList',
    method: 'post',
    data
  })
}
// 编辑签到题 - 获取所有题
export function getAllQuestionBySignId(data) {
  return request({
    url: '/edu/Question/getAllQuestionBySignId',
    method: 'post',
    data
  })
}
// 新增签到
export function insertSign(data) {
  return request({
    url: '/edu/Sign/insertSign',
    method: 'post',
    data
  })
}
// 编辑签到
export function updateSign(data) {
  return request({
    url: '/edu/Sign/updateSign',
    method: 'post',
    data
  })
}
// 签到时间列表
export function getSignTimeList(data) {
  return request({
    url: '/edu/Sign/getSignTimeList',
    method: 'post',
    data
  })
}
// 修改题目与答案列表
export function updateQuestionList(data) {
  return request({
    url: '/edu/Question/updateQuestionList',
    method: 'post',
    data
  })
}
// 新增题目与答案
export function insertQuestionList(data) {
  return request({
    url: '/edu/Question/insertQuestionList',
    method: 'post',
    data
  })
}
// 题库列表
export function getQuestionList(data) {
  return request({
    url: '/edu/Question/getQuestionList',
    method: 'post',
    data
  })
}
// 修改题目与答案
export function updateQuestion(data) {
  return request({
    url: '/edu/Question/updateQuestion',
    method: 'post',
    data
  })
}

// 删除题目
export function deleteQuestion(data) {
  return request({
    url: '/edu/Question/deleteQuestion',
    method: 'post',
    data
  })
}
// 签到中的用户明细
export function getSignUserList(data) {
  return request({
    url: '/edu/Sign/getSignUserList',
    method: 'post',
    data
  })
}
// 签到中的用户时间表
export function getSignDateList(data) {
  return request({
    url: '/edu/Sign/getSignDateList',
    method: 'post',
    data
  })
}
// 签到详情
export function getSign(data) {
  return request({
    url: '/edu/Sign/getSign',
    method: 'post',
    data
  })
}
// 删除签到活动
export function deleteSign(data) {
  return request({
    url: '/edu/Sign/deleteSign',
    method: 'post',
    data
  })
}
// 用户押金表
export function getUserDepositList(data) {
  return request({
    url: '/edu/Sign/getUserDepositList',
    method: 'post',
    data
  })
}





// 全部退押金
export function allRefund(data) {
  return request({
    url: '/edu/sign/refund',
    method: 'post',
    data
  })
}
// 押金列表返现
export function returnUserDeposit(data) {
  return request({
    url: '/edu/Sign/returnUserDeposit',
    method: 'post',
    data
  })
}
// 押金列表H5订单全部设为已退
export function setRefunded(data) {
  return request({
    url: '/edu/Sign/setRefunded',
    method: 'post',
    data
  })
}





// 押金导出列表
export function exportUserDeposit(data) {
  return request({
    url: '/edu/Sign/exportUserDeposit',
    method: 'post',
    data
  })
}
//获取补签时间列表
export function getOffsetSignDateList(data) {
  return request({
    url: '/edu/Sign/getOffsetSignDateList',
    method: 'post',
    data
  })
}
//补签
export function offsetSign(data) {
  return request({
    url: '/edu/Sign/offsetSign',
    method: 'post',
    data
  })
}




// 全部训练营
//创建训练营
export function addAllCamp(data) {
  return request({
    url: '/edu/Allcamp/addAllCamp',
    method: 'post',
    data
  })
}

//编辑训练营
export function editAllCamp(data) {
  return request({
    url: '/edu/Allcamp/editAllCamp',
    method: 'post',
    data
  })
}
//删除训练营
export function delAllCamp(data) {
  return request({
    url: '/edu/Allcamp/delAllCamp',
    method: 'post',
    data
  })
}
//上下架训练营
export function upLowerAllCamp(data) {
  return request({
    url: '/edu/Allcamp/upLowerAllCamp',
    method: 'post',
    data
  })
}

//全部训练营列表
export function allCampList(data) {
  return request({
    url: '/edu/Allcamp/allCampList',
    method: 'post',
    data
  })
}
//创建训练营位置
export function addCampPosition(data) {
  return request({
    url: '/edu/Allcamp/addCampPosition',
    method: 'post',
    data
  })
}

//编辑训练营位置
export function editCampPosition(data) {
  return request({
    url: '/edu/Allcamp/editCampPosition',
    method: 'post',
    data
  })
}

//获取位置列表
export function campPositionList(data) {
  return request({
    url: '/edu/Allcamp/campPositionList',
    method: 'post',
    data
  })
}

//获取训练营期详情
export function allCampDetails(data) {
  return request({
    url: '/edu/Allcamp/allCampDetails',
    method: 'post',
    data
  })
}



// //成长墙部分
// //成长墙列表
export function growthWallList(data) {
  return request({
    url: '/edu/Growthwall/growthWallList',
    method: 'post',
    data
  })
}
//查看详情
export function listScan(data) {
  return request({
    url: '/edu/Growthwall/growthWallDetails',
    method: 'post',
    data
  })
}

//显示或隐藏
export function growthWallShowDisplay(data) {
  return request({
    url: '/edu/Growthwall/upLowerGrowthwall',
    method: 'post',
    data
  })
}

//查看评论
export function scanComments(data) {
  return request({
    url: '/edu/Growthwall/growthWallComments',
    method: 'post',
    data
  })
}

//查看评论-评论的隐藏或显示
export function commentsShowDisplay(data) {
  return request({
    url: '/traceless/Growthwall/comments_show_or_display',
    method: 'post',
    data
  })
}


// //文章管理部分
// //列表展示
export function articleList(data) {
  return request({
    url: '/traceless/ArticleManagement/article_list',
    method: 'post',
    data
  })
}

// //添加提交文章
// export function addSubmitArticle(data) {
//   return request({
//     url: '/traceless/ArticleManagement/add_submit_article',
//     method: 'post',
//     data
//   })
// }

// //编辑文章
// export function editArticle(data) {
//   return request({
//     url: '/traceless/ArticleManagement/edit_article',
//     method: 'post',
//     data
//   })
// }

// //编辑提交文章
// export function editSubmitArticle(data) {
//   return request({
//     url: '/traceless/ArticleManagement/edit_submit_article',
//     method: 'post',
//     data
//   })
// }

// //显示或隐藏
export function showDisplayArticle(data) {
  return request({
    url: '/traceless/ArticleManagement/show_or_display_article',
    method: 'post',
    data
  })
}

// //置顶或取消置顶
export function istopArticle(data) {
  return request({
    url: '/traceless/ArticleManagement/istop_article',
    method: 'post',
    data
  })
}



// //使用帮助部分
// //列表展示
export function usehelpList(data) {
  return request({
    url: '/traceless/Usehelp/usehelp_list',
    method: 'post',
    data
  })
}

//使用帮助
export function addSubmitUsehelp(data) {
  return request({
    url: '/traceless/Usehelp/add_submit_usehelp',
    method: 'post',
    data
  })
}

//编辑页
export function editUsehelp(data) {
  return request({
    url: '/traceless/Usehelp/edit_usehelp',
    method: 'post',
    data
  })
}


//编辑提交
export function editSubmitUsehelp(data) {
  return request({
    url: '/traceless/Usehelp/edit_submit_usehelp',
    method: 'post',
    data
  })
}

//删除
export function deleteUsehelp(data) {
  return request({
    url: '/traceless/Usehelp/delete_usehelp',
    method: 'post',
    data
  })
}



// //用户管理部分
// //用户列表
export function userList(data) {
  return request({
    url: '/traceless/Userorder/userList',
    method: 'post',
    data
  })
}

export function userDetails(data) {
  return request({
    url: '/traceless/Userorder/userDetails',
    method: 'post',
    data
  })
}






//营销工具 - 调研问卷部分
// 获取问卷列表
export function getQuestionnaireList(data) {
  return request({
    url: '/Questionnaire/Questionnaire/getQuestionnaireList',
    method: 'post',
    data
  })
}

// 后台新增问卷
export function insertQuestionaire(data) {
  return request({
    url: '/Questionnaire/Questionnaire/insertQuestionaire',
    method: 'post',
    data
  })
}

// 后台编辑问卷
export function updateQuestionnaire(data) {
  return request({
    url: '/Questionnaire/Questionnaire/updateQuestionnaire',
    method: 'post',
    data
  })
}

// 后台编辑问卷修改问卷类型、选择的商品
export function updateQuestionnaireSpec(data) {
  return request({
    url: '/Questionnaire/Questionnaire/updateQuestionnaireSpec',
    method: 'post',
    data
  })
}

// 后台问卷分享设置
export function saveShareConfig(data) {
  return request({
    url: '/Questionnaire/Questionnaire/saveShareConfig',
    method: 'post',
    data
  })
}

// 后台问卷设置状态
export function updateQuestionnaireStatus(data) {
  return request({
    url: '/Questionnaire/Questionnaire/updateQuestionnaireStatus',
    method: 'post',
    data
  })
}

// 后台获取问卷详情
export function getQuestionnaire(data) {
  return request({
    url: '/Questionnaire/Questionnaire/getQuestionnaire',
    method: 'post',
    data
  })
}

// 管理员列表
export function questionnaireAuthUserList(data) {
  return request({
    url: '/Questionnaire/Questionnaire/questionnaireAuthUserList',
    method: 'post',
    data
  })
}

// 获取管理员列表（全部管理员）
export function QuestionnaireUserList(data) {
  return request({
    url: '/Questionnaire/Questionnaire/userList',
    method: 'post',
    data
  })
}

// 添加或移除管理员
export function execQuestionnaireAuthUser(data) {
  return request({
    url: '/Questionnaire/Questionnaire/execQuestionnaireAuthUser',
    method: 'post',
    data
  })
}


//营销工具 - 新人页面

//获取页面详情
export function NewUserConfigDetails(data) {
  return request({
    url: '/h5/h5_admin/NewUserConfigDetails',
    method: 'post',
    data
  })
}

// 新建/更新保存页面
export function NewUserConfigUpdate(data) {
  return request({
    url: '/h5/h5_admin/NewUserConfigUpdate',
    method: 'post',
    data
  })
}