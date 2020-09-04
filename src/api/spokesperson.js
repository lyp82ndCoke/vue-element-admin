//好妈妈代言人
import request from '@/utils/request'


// 获取代言人list
export function getSpokesManList(data) {
  return request({
    url: '/Spokes/User/getSpokesManList',
    method: 'post',
    data
  })
}

// 获取代言人资产明细
export function getUserPropertyDetail(data) {
  return request({
    url: '/Spokes/User/getUserPropertyDetail',
    method: 'post',
    data
  })
}

// 代言人的规则配置列表
export function getSpokesRuleList(data) {
  return request({
    url: '/Spokes/Rule/getSpokesRuleList',
    method: 'post',
    data
  })
}

// 新增代言人规则配置
export function addSpokesRule(data) {
  return request({
    url: '/Spokes/Rule/addSpokesRule',
    method: 'post',
    data
  })
}

// 修改代言人规则配置
export function updateSpokesRule(data) {
  return request({
    url: '/Spokes/Rule/updateSpokesRule',
    method: 'post',
    data
  })
}

// 删除代言人规则配置
export function deleteSpokesRule(data) {
  return request({
    url: '/Spokes/Rule/deleteSpokesRule',
    method: 'post',
    data
  })
}

// 爱心值增加历史
export function getUserScoreList(data) {
  return request({
    url: '/Spokes/Score/getScoreLogList',
    method: 'post',
    data
  })
}

// 获取爱心值配置
export function getScoreRule(data) {
  return request({
    url: '/Spokes/Rule/getScoreRule',
    method: 'post',
    data
  })
}

// 更改爱心值配置
export function updateScoreRule(data) {
  return request({
    url: '/Spokes/Rule/updateScoreRule',
    method: 'post',
    data
  })
}

//造福人数列表
export function getUserRelationList(data) {
  return request({
    url: '/Spokes/User/getUserRelationList',
    method: 'post',
    data
  })
}

// 获取等级列表
export function getLevelList(data) {
  return request({
    url: '/Spokes/Level/getLevelList',
    method: 'post',
    data
  })
}

// 更改等级
export function updateLevel(data) {
  return request({
    url: '/Spokes/Level/updateLevel',
    method: 'post',
    data
  })
}

// 获取各等级人数
export function getEachLevelUserNum(data) {
  return request({
    url: '/Spokes/Level/getEachLevelUserNum',
    method: 'post',
    data
  })
}

// 封禁用户与开启
export function updateUserStatus(data) {
  return request({
    url: '/Spokes/User/updateUserStatus',
    method: 'post',
    data
  })
}