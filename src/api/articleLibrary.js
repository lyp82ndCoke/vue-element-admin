//文章库 && 案例库 && 辅导员管理 && 教研管理 && 我的案例库 && 我的文章库
import request from '@/utils/request'

// 文章库--文章列表
export function getArticleList(data){
  return request({
    url: '/tutorship/article/article_list',
    method: 'post',
    data
  })
}
// 文章库--编辑文章详情 && 添加文章
export function editArticleList(data){
  return request({
    url: '/tutorship/article/edit_article',
    method: 'post',
    data
  })
}
// 文章库--编辑提交文章
export function editArticleSubmit(data){
  return request({
    url: '/tutorship/article/edit_article_submit',
    method: 'post',
    data
  })
}
// 文章库--删除文章
export function delArticleList(data){
  return request({
    url: '/tutorship/article/delete_article',
    method: 'post',
    data
  })
}
// 文章来源
export function getSource(data){
  return request({
    url: '/tutorship/Counselorquestion/source',
    method: 'post',
    data
  })
}
// 文章出处
export function getReferences(data){
  return request({
    url: '/tutorship/Counselorquestion/references',
    method: 'post',
    data
  })
}
//文章引用主题数量列表
export function getRelationList(data){
  return request({
    url: '/tutorship/article/article_relation_list',
    method: 'post',
    data
  })
}
/* 文章库 获取微信头图标题
  article_url | Y | 微信文章地址
*/
export function getWxTitlePic(params){
  return request({
    url: 'https://xdata.zmedc.com/baseapi/wx/get_article_info',
    method: 'get',
    params
  })
}




// 案例库--案例列表
export function getCaseList(data){
  return request({
    url: '/tutorship/cases/case_list',
    method: 'post',
    data
  })
}
// 案例库--编辑
export function editCaseList(data){
  return request({
    url: '/tutorship/cases/EditCaseInfo',
    method: 'post',
    data
  })
}
// 案例库--编辑提交
export function upDateCaseList(data){
  return request({
    url: '/tutorship/Cases/UpdateCaseSubmit',
    method: 'post',
    data
  })
}
// 案例库--删除案例
export function delCaseList(data){
  return request({
    url: '/tutorship/cases/delete_case',
    method: 'post',
    data
  })
}
//案例库--引用数量 alert
export function caseRelationList(data){
  return request ({
    url: '/tutorship/cases/CaseRelationList',
    method: 'post',
    data
  })
}


//辅导员列表
export function getCounsellorList(data){
  return request({
    url: 'tutorship/counsellor/counsellorList',
    method: 'post',
    data
  })
}
// 辅导员 && 教研 清退
export function removeCounsellorList(data){
  return request({
    url: 'tutorship/counsellor/userBack',
    method: 'post',
    data
  })
}
/* 
  辅导员 && 教研 启用
  参数名称 | 是否必填 | 说明 
  user_uuid | Y | 用户userid
*/
export function userOnCounsellor(data){
  return request({
    url: 'tutorship/Counsellor/userOn',
    method: 'post',
    data
  })
}

//辅导员删除
export function delCounsellorList(data){
  return request({
    url: 'tutorship/counsellor/counsellor_del',
    method: 'post',
    data
  })
}
//新建，编辑辅导员 && 教研 提交
export function addCounsellorList(data){
  return request({
    url: 'tutorship/counsellor/add',
    method: 'post',
    data
  })
}
//获取编辑教研详情
export function getEditDetailList(params){
  return request({
    url: 'tutorship/counsellor/add',
    method: 'get',
    params
  })
}
//添加辅导员 获取关联用户
export function getRelationUserList(data){
  return request({
    url: 'system/User/getRelationUserList',
    method: 'post',
    data
  })
}
//辅导员 获取岗位
export function getStation(data){
  return request({
    url: '/tutorship/Counsellor/getStation',
    method: 'post',
    data
  })
}

//教研管理 列表
export function getSchedulingGroup(data){
  return request({
    url: 'tutorship/Counsellor/teachingList',
    method: 'post',
    data
  })
}


/*  我的案例库 列表
  /tutorship/CounselorCase/index
    | 参数名称 | 是否必须 | 说明 
    |------|------|----|
    | state| Y | 状态(2.已采纳 3.待审核(默认为2) 4.全部（高强使用）)
    | page_num | N |当前页面(默认第1页)
    | case_title | N |标题(默认为空)
    | status | N |审核状态：0.全部 1.审核中 3.修订 4.已废弃
*/
export function getCounselorCaseList(data){
  return request({
    url: '/tutorship/CounselorCase/index',
    method: 'post',
    data
  })
}
//我的案例库 获取修订案例
export function reviseCounselorCaseList(data){
  return request({
    url: '/tutorship/CounselorCase/case_revise',
    method: 'post',
    data
  })
}
//我的案例库 提交修订案例
export function upDateCounselorCaseList(data){
  return request({
    url: '/tutorship/CounselorCase/case_update',
    method: 'post',
    data
  })
}
//我的案例库 上传案例
export function addCounselorCaseList(data){
  return request({
    url: '/tutorship/CounselorCase/add_case',
    method: 'post',
    data
  })
}
//我的案例库 添加案例 通过主题 筛选问题列表
export function getQuestionList(data){
  return request({
    url: '/tutorship/CounselorQuestion/index',
    method: 'post',
    data
  })
}
//我的案例库-- 训练营信息列表 训练营 + 群
export function getCampMsgList(data){
  return request({
    url: '/tutorship/CounselorQuestion/camp_msg_list',
    method: 'post',
    data
  })
}
//根据训练营 和 用户昵称 查出用户基本信息
export function getCampUserMsg(data){
  return request({
    url: '/tutorship/CounselorQuestion/camp_user_msg',
    method: 'post',
    data
  })
}

//根据训练营 和 群 查出宝宝基本信息
export function getCampBabyMst(data){
  return request({
    url: '/tutorship/CounselorQuestion/camp_baby_msg',
    method: 'post',
    data
  })
}
//我的案例库 草稿箱-->添加提交案例到草稿箱
export function addCaseDrafs(data){
  return request({
    url: '/tutorship/CounselorCase/add_case_drafs_push',
    method: 'post',
    data
  })
}
//草稿箱 - 删除案例
export function deleteCaseDrafs(data){
  return request({
    url: '/tutorship/CounselorCase/delete_case_drafs',
    method: 'post',
    data
  })
}
//草稿箱 - 获取编辑案例的详情
export function editCaseDetails(data){
  return request({
    url: '/tutorship/CounselorCase/case_revise_drafs',
    method: 'post',
    data
  })
}
//草稿箱 - 草稿箱案例提交审核
export function addCaseExamine(data){
  return request({
    url: '/tutorship/CounselorCase/add_case_draf_toexamine',
    method: 'post',
    data
  })
}
//草稿箱 - 编辑案例提交
export function editCaseDrafs(data){
  return request({
    url: '/tutorship/CounselorCase/edit_case_drafs',
    method: 'post',
    data
  })
}




// 我的文章库 -- 待做
//我的文章库-列表
export function getCounselorArticle(data){
  return request({
    url: '/tutorship/CounselorArticle/index',
    method: 'post',
    data
  })
}
//我的文章库-问题关联主题详情
export function getArticleTheme(data){
  return request({
    url: '/tutorship/CounselorArticle/relation_theme_list',
    method: 'post',
    data
  })
}
//我的文章库-添加文章
export function addConsellorArticle(data){
  return request({
    url: '/tutorship/CounselorArticle/add_article',
    method: 'post',
    data
  })
}
//我的文章库-获取修订详情
export function getUpdateConsellorArticle(data){
  return request({
    url: '/tutorship/CounselorArticle/article_revise',
    method: 'post',
    data
  })
}
//我的文章库-修订文章 && 文章库-编辑
export function updateConsellorArticle(data){
  return request({
    url: '/tutorship/CounselorArticle/article_update',
    method: 'post',
    data
  })
}
//问答库-上传文章
export function addArticleList(data){
  return request({
    url: '/tutorship/CounselorQuestion/add_article',
    method: 'post',
    data
  })
}
//我的文章库 文章详情
export function getArticleDetail(data){
  return request({
    url: '/tutorship/CounselorArticle/article_msg',
    method: 'post',
    data
  })
}
