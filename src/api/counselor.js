import request from '@/utils/request'
// 获取年龄主题tree /tutorship/Label/getLabelRelationList
export function getThemeTree(data) {
  return request({
    url: 'tutorship/Label/getLabelRelationList',
    method: 'post',
    data
  })
}

// 辅导员模块
/*  获取辅导员列表
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | page_num| N| 页码 （默认第一页） |
    | page_size| N| 每页显示条数 |
    | work_status| N| 工作状态 1.有工作全职2.无工作全职妈妈3.有工作兼职4.自己成立亲子阅读馆|
    | now_work_vocation| N| 从事职业 |
    | education| N| 最高学历 1高中 2大专  3本科  4研究生  5博士|
    | major| N| 专业 |
    | contract_time| N| 签约时间 |
    | correction_time| N| 转正时间 |
    | cancellation_time| N| 解约时间 |
    | status| N| 状态 1正常  2清退 |
    | station| N| 岗位 0.无1.实习辅导员2.辅导员3.高级辅导员4.导师辅导员5.管理员6.项目经理|
    | address_id| N| 地区id |
    | is_select| N| 是否是下拉框获取辅导员  1 是|
    | real_name| N| 真实姓名 |

*/
export function getCounselorList(data) {
  return request({
    url: 'tutorship/counsellor/counsellorList',
    method: 'post',
    data
  })
}

/*  获取问答列表相关
    | state | Y | int| 问答状态(0.全部 1.审核中 2.已采纳 3.辅导员全部列表 (默认为0))|
    | relation_id| N| int |主题关联集合id(默认为空)|
    | class_id| N|int |问题属性id(默认为空) |
    | question| N| string |问题场景关键词(默认为空) |
    | is_anwser| N| int |是否为答案(1.答案,0.问答 (默认为 0)) |
    | status| N | int |审核状态：0.全部 1.审核中3.修订4.已废弃|
    | page_num| Y| int |当前页面(默认第1页) |
    | page_size|N| int |每页显示数，默认10|
    | order|N| string |排序规则`a.create_time desc or FIELD (a.status,1,2,4,3)`|

*/
export function getAnswers(data) {
  return request({
    url: 'tutorship/CounselorQuestion/index',
    method: 'post',
    data
  })
}

/*  获取问答关联主题
    tutorship/CounselorArticle/relation_theme_list
      | 参数名称 | 是否必须 | 说明 |
      |------|------|----|
      | id| Y| 问题、文章id|
      | page |Y|当前页(默认第一页)|
*/
export function getRelationThemeList(data) {
  return request({
    url: 'tutorship/CounselorArticle/relation_theme_list',
    method: 'post',
    data
  })
}
/*  获取答案详情（编辑）
      question_id Y 问题id(备注:补充答案传问题id)
*/
export function getAnswerserDetail(data) {
  return request({
    url: 'tutorship/CounselorQuestion/supplement_answer',
    method: 'post',
    data
  })
}
/*  补充答案
      question_id Y 问题id(备注:补充答案传问题id)
      answer Y  副答案内容
*/
export function submitOtherAnswer(data) {
  return request({
    url: 'tutorship/CounselorQuestion/add_supplement_answer',
    method: 'post',
    data
  })
}
/*  创建问答
      | question_class_id| Y| 问题分类(属性)id （1.是问题的问题 2.不是问题的问题 3.看不见的问题）|
      | answer|Y| 主答案 |
      |label_ids|Y|主题ids|
      | family_education_trap|N| 家庭教育陷阱 |
*/
export function createAnswer(data) {
  return request({
    url: 'tutorship/CounselorQuestion/add_question',
    method: 'post',
    data
  })
}
/*  修订问答获取详情
      | question_class_id| Y| 问题分类(属性)id （1.是问题的问题 2.不是问题的问题 3.看不见的问题）|
      | answer|Y| 主答案 |
      |label_ids|Y|主题ids|
      | family_education_trap|N| 家庭教育陷阱 |
*/
export function getRevisionAnswer(data) {
  return request({
    url: 'tutorship/CounselorQuestion/revise_msg',
    method: 'post',
    data
  })
}

/*  提交修订问答
      | question_class_id| Y| 问题分类(属性)id （1.是问题的问题 2.不是问题的问题 3.看不见的问题）|
      | answer|Y| 主答案 |
      |label_ids|Y|主题ids|
      | family_education_trap|N| 家庭教育陷阱 |
*/
export function updateRevise(data) {
  return request({
    url: 'tutorship/CounselorQuestion/update_revise',
    method: 'post',
    data
  })
}
/*  问题关联主题详情
      | question_id| Y| 问题id|
      | page |Y|当前页(默认第一页)|
*/
export function getThemeList(data) {
  return request({
    url: 'tutorship/CounselorQuestion/question_theme_relation_list',
    method: 'post',
    data
  })
}
/* 获贡献值规则
 */
export function getIntegralRule(data) {
  return request({
    url: 'tutorship/Counselorinformation/contribution_rule',
    method: 'post',
    data
  })
}
/*  我的贡献值查询
      | date |Y| array |时间区间|
*/
export function getMyIntegral(data) {
  return request({
    url: 'tutorship/Counselorinformation/contribution',
    method: 'post',
    data
  })
}

/*  贡献者管理列表（贡献规则）
      | date |Y| array |时间区间|
*/
export function getIntegralTable(data) {
  return request({
    url: 'tutorship/contribution/contributionList',
    method: 'post',
    data
  })
}
/*  改变贡献值
      
*/
export function changeIntegral(data) {
  return request({
    url: 'tutorship/contribution/changeContribution',
    method: 'post',
    data
  })
}

/*  改变贡献值
      
*/
export function getRankList(data) {
  return request({
    url: 'tutorship/counsellor/rankingList',
    method: 'post',
    data
  })
}

// 社会网络化

/* 
    排班管理
    
    | status| N| 状态 1 排期中 2进行中 3已过期 4 已关闭|
    | group_name| N| 群名称|
    | page_num| N| 当前页码|
    | page_size| N| 每页显示条数|

// 社会网络化

/* 
    排班管理

    未写地址
*/
export function getScheduleList(data) {
  return request({
    url: 'tutorship/scheduling/schedulingList',
    method: 'post',
    data
  })
}
/* 
    查看排班备注

    | 参数名称 | 是否必须 | 说明 |
    scheduling_uuid：Y
*/
export function getScheduleMark(data) {
  return request({
    url: 'tutorship/scheduling/seeRemarks',
    method: 'post',
    data
  })
}
/* 
    查看人员排班状态

    | 参数名称 | 是否必须 | 说明 |
    user_uuid | Y
*/
export function getScheduleUserStatus(data) {
  return request({
    url: 'tutorship/scheduling/isOtherScheduling',
    method: 'post',
    data
  })
}
/* 
    获取训练营商品（作业、阅读戒吼等）

    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
*/
export function getGoods(data) {
  return request({
    url: 'tutorship/scheduling/getGoods',
    method: 'post',
    data
  })
}

/* 
    新建、编辑排班

    | 参数名称 | 是否必须 | 说明 |
  |------|------|----|
  | scheduling_uuid| Y| 主键唯一标识id|
  | remarks| N| 备注评语|
*/
export function addSchedule(data) {
  return request({
    url: 'tutorship/scheduling/add',
    method: 'post',
    data
  })
}
/* 
    获取排班详情
    | 参数名称 | 是否必须 | 说明 |
  |------|------|----|
  | scheduling_uuid| Y| 主键唯一标识id|
*/
export function getCounselorDetail(params) {
  return request({
    url: 'tutorship/scheduling/add',
    method: 'get',
    params
  })
}

/* 
    关闭排班

    | 参数名称 | 是否必须 | 说明 |
  |------|------|----|
  | scheduling_uuid| Y| 主键唯一标识id|
  | remarks| N| 备注评语|
*/
export function closeSchedule(data) {
  return request({
    url: 'tutorship/scheduling/closeScheduling',
    method: 'post',
    data
  })
}

/* 
    删除排班

    | 参数名称 | 是否必须 | 说明 |
  |------|------|----|
  | scheduling_uuid| Y| 主键唯一标识id|
*/
export function delSchedule(data) {
  return request({
    url: 'tutorship/scheduling/delScheduling',
    method: 'post',
    data
  })
}

// 问答库
/* 
    获取编辑问答详情
    tutorship/question/edit_question
    | 参数名称 | 是否必须 | 说明 |
    | question_id| Y| 问题id|
*/
export function getEditAnswerDetail(data) {
  return request({
    url: 'tutorship/question/edit_question',
    method: 'post',
    data
  })
}
/* 
    提交编辑问答
    tutorship/question/edit_submit_question 
    |------|------|----|
    | question_id| Y| 问题id|
    | question| Y| 问题标题|
    | question_class_id| Y| 问题属性|
    | label_ids| Y| 问题主题ids|
    | answer| Y| 主答案|
    | other_answers| Y| 其他答案(一维数组)|
    | family_education_trap| Y| 教育陷阱|
*/
export function submitEditQuestion(data) {
  return request({
    url: 'tutorship/question/edit_submit_question',
    method: 'post',
    data
  })
}
/* 
    我的排班
  
*/
export function myScheduling(data) {
  return request({
    url: 'tutorship/Counselorinformation/Scheduling',
    method: 'post',
    data
  })
}

/* 
    获取群角色list
    tutorship/scheduling/getGroup
*/
export function getGroupRoleList(data) {
  return request({
    url: 'tutorship/scheduling/getGroup',
    method: 'post',
    data
  })
}

/* 
    获取排班状态list
    tutorship/scheduling/isOtherScheduling
*/
export function getIsOtherScheduling(data) {
  return request({
    url: 'tutorship/scheduling/isOtherScheduling',
    method: 'post',
    data
  })
}

/* 
    获取同类标签list
    tutorship/sameThemeList/sameThemeList
*/
export function getSameThemeList(data) {
  return request({
    url: 'tutorship/CounselorQuestion/sameThemeList',
    method: 'post',
    data
  })
}

/* 
    获取辅导员个人资料
    tutorship/Counselorinformation/index
*/
export function getCounselorInfo(data) {
  return request({
    url: 'tutorship/Counselorinformation/index',
    method: 'post',
    data
  })
}

/* 
    更新辅导员个人资料
    tutorship/Counselorinformation/update
*/
export function upDateCounselorInfo(data) {
  return request({
    url: 'tutorship/Counselorinformation/update',
    method: 'post',
    data
  })
}

// 教研

/* 
    答案置顶和取消置顶
    tutorship/question/answer_istop
*/
export function answerIsTop(data) {
  return request({
    url: 'tutorship/question/answer_istop',
    method: 'post',
    data
  })
}

/* 
    答案删除
    tutorship/question/delete_answer
*/
export function delAnswer(data) {
  return request({
    url: 'tutorship/question/delete_answer',
    method: 'post',
    data
  })
}
/* 
    答案问答
    tutorship/question/delete_question
*/
export function delQuestions(data) {
  return request({
    url: 'tutorship/question/delete_question',
    method: 'post',
    data
  })
}
/* 
    教研我的资料
    tutorship/Counsellor/teachInfo
*/
export function teachInfo(data) {
  return request({
    url: 'tutorship/User/teachInfo',
    method: 'post',
    data
  })
}

/* 
    教研更新我的资料
    tutorship/counsellor/add
*/
export function upDateInfo(data) {
  return request({
    url: 'tutorship/Counsellor/editTeach',
    method: 'post',
    data
  })
}



