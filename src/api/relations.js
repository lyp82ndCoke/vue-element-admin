//关系管理 && 待审核处理
import request from '@/utils/request'

//关系管理 -- 列表
export function getRelationList(data){
  return request({
    url: '/tutorship/Labelrelation/LabelRelationList',
    method: 'post',
    data
  })
}
//关系管理->关联列表显示或隐藏
export function showRelationList(data){
  return request({
    url: '/tutorship/Labelrelation/LabelRelationListShowOrDisplay',
    method: 'post',
    data
  })
}
//关系管理->二级问题标签补充页或编辑页
export function describeLabel(data){
  return request({
    url: '/tutorship/Labelrelation/LabelRelationSecondLabelDescribe',
    method: 'post',
    data
  })
}
//关系管理->二级问题标签补充页或编辑页提交数据
export function submitRelationLabel(data){
  return request({
    url: '/tutorship/Labelrelation/LabelRelationDescribeSubmit',
    method: 'post',
    data
  })
}
//关系管理->通过关联ID查找关联标签四条内容
export function findLabelDetail(data){
  return request({
    url: '/tutorship/Labelrelation/LabelRelationSeachLabelDetails',
    method: 'post',
    data
  })
}
//关系管理->相关推荐->案例/文章/问答列表
export function contentRelatedList(data){
  return request({
    url: '/tutorship/Labelrelation/related_recommendations_list',
    method: 'post',
    data
  })
}
//关系管理->案例/文章/问答->排序
export function caseRelationSort(data){
  return request({
    url: '/tutorship/Labelrelation/related_recommendations_sort',
    method: 'post',
    data
  })
}
//关系管理->案例->移除
export function removeCaseList(data){
  return request({
    url: '/tutorship/Labelrelation/related_recommendations_remove',
    method: 'post',
    data
  })
}
//关系管理->相关内容->手动关联页面(案例/文章/问答共用)
export function relatedHandCase(data){
  return request({
    url: '/tutorship/Labelrelation/related_hand',
    method: 'post',
    data
  })
}
//关系管理->相关内容->手动关联单条
export function relatedHandCaseOne(data){
  return request({
    // url: '/tutorship/Labelrelation/related_hand_case_one',
    url: '/tutorship/Labelrelation/related_hand_one',
    method: 'post',
    data
  })
}
//关系管理->相关内容->案例/文章/问答->批量关联(审核成功)
export function relatedHandCaseMore(data){
  return request({
    url: '/tutorship/Labelrelation/related_hand_more',
    method: 'post',
    data
  })
}

//关系管理->相关推荐->数据统计
// export function getDataRelation(data){
//   return request({
//     url: '/tutorship/Labelrelation/data_statistics_relation',
//     method: 'post',
//     data
//   })
// }

/* 
  待处理审核->待审核列表 && 已完成审核列表
  | 参数名称 | 是否必须 | 说明
  |examine_type | Y |  审核状态1.待审核页2.已完成审核页
  |type   |  Y   |  问答审核类型1.待审核问答2.待审核答案3.待审核案例
  |title | N | 查询标题
  |page_num  |  N   |当前页数
  |page_size   |  N   |显示多少条
*/
export function getWaitExamineList(data){
  return request({
    url: '/tutorship/Waitexamine/WaitExamineList',
    method: 'post',
    data
  })
}

/*
  待审核->获取修订页详情(问答/答案/案例)
  |object_id | Y |  问题id/答案ID/或问答ID
  |type | Y |  默认1,问答审核状态1.待审核问答2.待审核答案3.待审核案例
*/
export function getWaitExamineDetail(data){
  return request({
    url: '/tutorship/Waitexamine/revise',
    method: 'post',
    data
  })
}

/*
  待审核->修订提交数据(问答/答案/案例)
  |object_id | Y |  问题id/答案ID/或问答ID
  |type | Y |  默认1,问答审核状态1.待审核问答2.待审核答案3.待审核案例
  |opinion_content | Y |  修订意见内容
*/
export function SubmitWaitDetail(data){
  return request({
    url: '/tutorship/Waitexamine/revise_submit',
    method: 'post',
    data
  })
}

/*
  待审核 已完成审核->废弃(问答/答案/案例)
  |examine_type | Y |  1.待审核2.已完成审核
  |type | Y |  默认1,问答审核状态1.待审核问答2.待审核答案3.待审核案例
  |object_id | Y |  问题id/答案ID/文章ID
*/
export function discardQuestion(data){
  return request({
    url: '/tutorship/Waitexamine/discard_question',
    method: 'post',
    data
  })
}

/*
  待审核->获取采纳页信息(问答/答案/案例)
  |type | Y |  1.待审核问答2.待审核答案3.待审核案例
  |object_id | Y |  问题id/答案ID/文章ID
*/
export function getAdoptList(data){
  return request({
    url: '/tutorship/Waitexamine/adopt_list',
    method: 'post',
    data
  })
}

/*
  待审核问答->采纳提交
  |question_class_id | Y |  问题属性id
  |relation_id | Y |  关联id
  |question | Y |  问题场景
  |question_id | Y |  问题id
  |answer_content | Y |  答案内容
*/
export function adoptSubmitQuestion(data){
  return request({
    url: '/tutorship/Waitexamine/adopt_submit_question',
    method: 'post',
    data
  })
}

/*
  待审核答案->采纳提交
  |answer_id | Y |  答案id
  |question | Y |  问题场景
  |answer_content | Y |  答案内容
*/
export function adoptSubmitAnswer(data){
  return request({
    url: '/tutorship/Waitexamine/adopt_submit_question_answer',
    method: 'post',
    data
  })
}

/*
  待审核案例->采纳提交
  |case_id | Y |  案例id
  |case_title | Y |  案例标题
  |parents_first_asked | Y |  家长首问
  |child_situation | Y |  孩子当时情况
  |diagnosis | Y |  诊断
  |suggested_guidance | Y |  建议指导
  |user_action | Y |  用户行动
  |results | Y |  成效
  |case_tracking | Y |  个案追踪 -> 见证性材料
*/
export function adoptSubmitCase(data){
  return request({
    url: '/tutorship/Waitexamine/adopt_submit_question_case',
    method: 'post',
    data
  })
}

/*
  教研采纳问答/答案/案例
  |type | Y |  类型type=1问答2.答案3.案例
  |object_id | Y |  类型 项目ID,1.问答2.答案3.案例
*/
export function adoptObject(data){
  return request({
    url: '/tutorship/Waitexamine/adopt_object',
    method: 'post',
    data
  })
}










