// 营销工具 - 调研问卷数据统计
import request from '@/utils/request'

// 1.问卷列表 -> 基本图标
export function getChart(data){
  return request({
    url: '/questionnaire/information/chart',
    method: 'post',
    data
  })
}
// 2.单选/多选 -> 其他选项(数据列表)
export function getOtherList(data){
  return request({
    url: '/questionnaire/information/otherOptionList',
    method: 'post',
    data
  })
}
// 3.导出数据
// export function exportData(data){
//   return request({
//     url: '/questionnaire/information/exportData',
//     method: 'post',
//     data
//   })
// }
// 4.答卷详情（有效列表及无效列表）
export function answerSheetList(data){
  return request({
    url: '/questionnaire/information/answerSheetList',
    method: 'post',
    data
  })
}
// 5.填空题分页
export function userFillContentList(data){
  return request({
    url: '/questionnaire/information/userFillContentList',
    method: 'post',
    data
  })
}
// 6.答卷详情 -> 查看
export function answerInfoDetails(data){
  return request({
    url: '/questionnaire/information/answerInfo',
    method: 'post',
    data
  })
}
// 7.答卷详情标为无效(单个或批量)
export function answerInfoInvalid(data){
  return request({
    url: '/questionnaire/information/answerInvalid',
    method: 'post',
    data
  })
}
// 8.答卷详情还原为有效(单个或批量)
export function restoreInvalidAnswer(data){
  return request({
    url: '/questionnaire/information/restoreInvalidAnswer',
    method: 'post',
    data
  })
}
// 9.答卷详情 无效答卷 删除(单个或批量)
export function deleteInvalidAnswer(data){
  return request({
    url: '/questionnaire/information/deleteInvalidAnswer',
    method: 'post',
    data
  })
}

