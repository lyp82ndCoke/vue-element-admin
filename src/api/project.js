import request from '@/utils/request'
/*  项目经理列表
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | item_id| Y| 商品id |
*/
export function getManagerList(data) {
  return request({
    url: 'tutorship/Counsellor/managerList',
    method: 'post',
    data
  })
}

/*  项目经理审核案例列表
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | type |  Y  | 1.待审核2.已审核
    | case_title |  N  | 案例标题 
    | page_size |  N  | 显示多少条
    | page_num |  N  | 页码 
*/
export function getCaseList(data) {
  return request({
    url: 'tutorship/Managerexamine/case_list',
    method: 'post',
    data
  })
}

/*  项目经理采纳案例详情
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | case_id |  Y  | 案例id
*/
export function getCaseDetail(data) {
  return request({
    url: 'tutorship/Managerexamine/case_detail',
    method: 'post',
    data
  })
}
/*  项目经理采纳案例提交
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | case_id |  Y  | 案例id
    | case_title |  Y  | 案例标题
    | child_situation |  Y  | 孩子当时情况
    | diagnosis |  Y  | 诊断
    | suggest |  Y  | 建议指导
    | user_action |  Y  | 用户行动
    | effect |  Y  | 成效
    | case_track |  Y  | 个案追踪 -> 见证性材料
*/
export function caseDetailSubmit(data) {
  return request({
    url: 'tutorship/Managerexamine/case_detail_submit',
    method: 'post',
    data
  })
}

/*  项目经理修订案例
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | case_id |  Y  | 案例id
*/
export function getReviseCase(data) {
  return request({
    url: 'tutorship/Managerexamine/manager_revise_case',
    method: 'post',
    data
  })
}

/*  项目经理修订案例提交
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | case_id |  Y  | 案例id
    | opinion_content |  Y  | 修订意见
*/
export function getReviseCaseSubmit(data) {
  return request({
    url: 'tutorship/Managerexamine/manager_revise_case_submit',
    method: 'post',
    data
  })
}

/*  项目经理废弃案例
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | case_id |  Y  | 案例id
*/
export function managerDiscardCase(data) {
  return request({
    url: 'tutorship/Managerexamine/manager_discard_case',
    method: 'post',
    data
  })
}
/*  项目经理采纳案例
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | case_id |  Y  | 案例id
*/
export function adoptCase(data) {
  return request({
    url: 'tutorship/Managerexamine/adopt_case',
    method: 'post',
    data
  })
}

/*  项目经理关联训练营列表
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
*/
export function getRelationGoodsList(data) {
  return request({
    url: 'tutorship/Counsellor/managerRelationGoodsList',
    method: 'post',
    data
  })
}

/*  通过项目经理uuiD获取他所负责的训练营商品ID
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    project_manager_uuid | Y | 项目负责人的UUID
*/
export function getResponsibleGoods(data) {
  return request({
    url: 'tutorship/Managerexamine/responsible_goods',
    method: 'post',
    data
  })
}

/*  编辑项目经理负责的训练营
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    goods_info | Y | 训练营ID(数组)
      goods_id | Y | 训练营ID
      goods_name | Y | 训练营名称
    project_manager_uuid | Y | 项目经理的UUID

    例:
    "goods_info": 
      [
        {"goods_id":1,"goods_name":"作业活动训练营"},
        {"goods_id":2,"goods_name":"阅读活动训练营"},
        {"goods_id":3,"goods_name":"戒吼活动训练营"}
      ],
     "project_manager_uuid": "user3N18VK2b6n4e"
*/
export function getResponsibleEdit(data) {
  return request({
    url: 'tutorship/Managerexamine/responsible_goods_edit',
    method: 'post',
    data
  })
}

/*  获取训练营数据
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
*/
export function getCampList(data) {
  return request({
    url: 'tutorship/CounselorQuestion/getCampList',
    method: 'post',
    data
  })
}