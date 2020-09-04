import request from '@/utils/request'

// 签到列表
export function signList(data) {
  return request({
    url: 'portalsign/sign_admin/signList',
    method: 'post',
    data
  })
}

// 上下架
export function setStatus(data) {
  return request({
    url: 'portalsign/sign_admin/setStatus',
    method: 'post',
    data
  })
}
// 签到日历
export function getSignCalendar(data) {
  return request({
    url: 'portalsign/sign_admin/getSignCalendar',
    method: 'post',
    data
  })
}
// 签到-某一天的题目详情
export function getSignQuestion(data) {
  return request({
    url: 'portalsign/sign_admin/getSignQuestion',
    method: 'post',
    data
  })
}
// 编辑签到题
export function modifySignQuestion(data) {
  return request({
    url: 'portalsign/sign_admin/modifySignQuestion',
    method: 'post',
    data
  })
}

// 创建签到题
export function createSignQuestion(data) {
  return request({
    url: 'portalsign/sign_admin/createSignQuestion',
    method: 'post',
    data
  })
}

// 创建签到
export function createSign(data) {
  return request({
    url: 'portalsign/sign_admin/createSign',
    method: 'post',
    data
  })
}
// 签到详情
export function getSignInfo(data) {
  return request({
    url: 'portalsign/sign_admin/getSign',
    method: 'post',
    data
  })
}
// 编辑签到
export function modifySign(data) {
  return request({
    url: 'portalsign/sign_admin/modifySign',
    method: 'post',
    data
  })
}
// 评论、试题管理
export function commentList(data) {
  return request({
    url: 'portalsign/comment_admin/ManagerList',
    method: 'post',
    data
  })
}
// 置顶、取消置顶
export function setTop(data) {
  return request({
    url: 'portalsign/comment_admin/CommentIsTopping',
    method: 'post',
    data
  })
}
// 显示或隐藏评论
export function switchShowApi(data) {
  return request({
    url: 'portalsign/comment_admin/CommentShowOrDisplay',
    method: 'post',
    data
  })
}
// 试题管理查看功能
export function questionScanList(data) {
  return request({
    url: 'portalsign/comment_admin/CommentQuestionScanList',
    method: 'post',
    data
  })
}
// 签到-删除题目

export function deleteQuestion(data) {
  return request({
    url: 'portalsign/sign_admin/deleteQuestion',
    method: 'post',
    data
  })
}
// 设为门户签到
export function setMicropage(data) {
  return request({
    url: 'portalsign/sign_admin/setMicropage',
    method: 'post',
    data
  })
}

// 签到统计概况
export function statisticsIndex(data) {
  return request({
    url: 'portalsign/sign_admin/StatisticsIndex',
    method: 'post',
    data
  })
}
// 签到统计列表
export function statisticsList(data) {
  return request({
    url: 'portalsign/sign_admin/StatisticsList',
    method: 'post',
    data
  })
}

