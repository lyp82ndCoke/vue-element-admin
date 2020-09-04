import request from '@/utils/request'


// 公众号列表
export function getNoPublic(data){
  return request({
    url: 'yfhd/Publicnum/Publist',
    method: 'post',
    data
  })
}
// 公众号移除
export function removeNoPublic(data){
  return request({
    url: 'yfhd/publicnum/delActive',
    method: 'post',
    data
  })
}
// 新建公众号
export function newNoPublic(data){
  return request({
    url: 'yfhd/publicnum/add',
    method: 'post',
    data
  })
}
//编辑公众号
export function editNoPublic(params){
  return request({
    url: 'yfhd/publicnum/add',
    method: 'get',
    params
  })
}
//公众号关联活动
export function activityPublic(data){
  return request({
    url: 'yfhd/publicnum/relationActive',
    method: 'post',
    data
  })
}
// 活动管理列表
export function getActList(data) {
  return request({
    url: 'yfhd/active/activeList',
    method: 'post',
    data
  })
}
// 活动管理 新建活动
export function addActivity(data) {
  return request({
    url: 'yfhd/active/add',
    method: 'post',
    data
  })
}
// 活动管理 编辑活动
export function editActivity(params){
  return request({
    url: 'yfhd/active/add',
    method: 'get',
    params
  })
}
// 活动管理 上下架
export function getStatus(data) {
  return request({
    url: 'yfhd/active/statusActive',
    method: 'post',
    data
  })
}
// 活动管理 删除
export function getDelete(data){
  return request({
    url: 'yfhd/active/del',
    method: 'post',
    data
  })
}
// 活动管理 关联的商品列表
export function getConnect(data){
  return request({
    url: 'yfhd/goods/goodsList',
    method: 'post',
    data
  })
}
// 排序的修改
// 活动管理 - 内容管理
export function getSortGoodsList(data){
  return request({
    url: 'yfhd/active/relationActiveGoodsList',
    method: 'post',
    data
  })
}
// 商品管理 - 素材管理
export function getSortSourceList(data){
  return request({
    url: 'yfhd/goods/relationGoodsAudioList',
    method: 'post',
    data
  })
}
// 活动管理 内容管理 排序可修改
export function updateActiveGoods(data){
  return request({
    url: 'yfhd/active/updateRelationActiveGoods',
    method: 'post',
    data
  })
}
// 商品管理 素材管理 排序可修改
export function updateGoodsAudio(data){
  return request({
    url: 'yfhd/goods/updateRelationGoodsAudio',
    method: 'post',
    data
  })
}

// 活动管理 关联的商品列表显示隐藏
export function getGoodStatus(data){
  return request({
    url: 'yfhd/goods/statusGoods',
    method: 'post',
    data
  })
}
// 活动管理 关联的商品移除
export function getGoodsDel(data){
  return request({
    url: 'yfhd/goods/del',
    method: 'post',
    data
  })
}
// 活动管理 该活动要关联的商品
export function getSure(data){
  return request({
    url: 'yfhd/active/relationGoods',
    method: 'post',
    data
  })
}
// 活动管理 广告管理 广告列表
export function advList(data){
  return request({
    url: 'yfhd/adv/advList',
    method: 'post',
    data
  })
}
// 活动管理 广告管理 新建广告
export function newAdv(data){
  return request({
    url: 'yfhd/adv/add',
    method: 'post',
    data
  })
}
// 活动管理 广告管理 删除广告
export function delAdv(data){
  return request({
    url: 'yfhd/adv/del',
    method: 'post',
    data
  })
}
// 活动管理 广告管理 上下架广告
export function advStatus(data){
  return request({
    url: 'yfhd/adv/statusAdv',
    method: 'post',
    data
  })
}
// 商品管理 内容管理 关联的素材列表
export function goodsSource(data){
  return request({
    url: 'yfhd/audio/audioList',
    method: 'post',
    data
  })
}
// 商品管理 给该商品关联素材
export function getGoodSource(data){
  return request({
    url: 'yfhd/goods/relationAudio',
    method: 'post',
    data
  })
}
// 商品管理 编辑
export function getEditGoods(params){
  return request({
    url: 'yfhd/goods/add',
    method: 'get',
    params
  })
}
// 商品管理 新建商品
export function ActivityGoods(data){
  return request({
    url: 'yfhd/goods/add',
    method: 'post',
    data
  })
}
// 新建音频
export function getActivitySource(data){
  return request({
    url: 'yfhd/audio/add',
    method: 'post',
    data
  })
}
// 编辑素材
export function getEditSource(params){
  return request({
    url: 'yfhd/audio/add',
    method: 'get',
    params
  })
}
// 删除素材
export function delSource(data){
  return request({
    url: 'yfhd/audio/del',
    method: 'post',
    data
  })
}
// 素材上下架
export function sourceStatus(data){
  return request({
    url: 'yfhd/audio/statusAudio',
    method: 'post',
    data
  })
}





export function getList(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getActivity(params) {
  return request({
    url: '/table/list',
    method: 'get',
    params
  })
}

export function getStaff(params) {
  return request({
    url: '/staff/list',
    method: 'get',
    params
  })
}

export function getMeun(params) {
  return request({
    url: '/meun/list',
    method: 'get',
    params
  })
}
