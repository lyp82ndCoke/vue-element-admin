import request from '@/utils/groupRequset';
// 商城 -> 微信群管理 & 商品管理(用户好评)
// 接口文档地址
// http://xdata.zmedc.com/service/basedata/doc.html

// 35.4查询群关系列表 
export function getChatroomRelation(params) {
  return request({
    url: '/service/basedata/praise/get_chatroom_relation_list',
    method: 'get',
    params
  })
}
// 35.10 查询商品列表 
export function getItemRelationList(params) {
  return request({
    url: '/service/basedata/praise/get_item_relation_list',
    method: 'get',
    params
  })
}
// 35.5 修改群关系
export function updateChatroomRelation(data) {
  return request({
    url: '/service/basedata/praise/update_chatroom_relation',
    method: 'post',
    data
  })
}

// 35.6 查询好评内容列表(结果)
export function getPraiseContent(params) {
  return request({
    url: '/service/basedata/praise/get_praise_content_list',
    method: 'get',
    params
  })
}

// 35.7 修改好评显示状态
export function updateContent(params) {
  return request({
    url: '/service/basedata/praise/update_praise_content_status',
    method: 'get',
    params
  })
}

// 35.13 修改置顶
export function updateFirst(params) {
  return request({
    url: '/service/basedata/praise/update_praise_content_first',
    method: 'get',
    params
  })
}


//查询用户好评分类
export function getSharinList(params) {
  return request({
    url: '/service/basedata/praise/get_item_relation_list',
    method: 'get',
    params
  })
}

// 35.12 查询群成员列表
export function getMemberList(params) {
  return request({
    url: '/service/basedata/praise/get_chatroom_member_list',
    method: 'get',
    params
  })
}

// 35.14 添加其他来源好评内容
export function addPraiseContent(data) {
  return request({
    url: '/service/basedata/praise/add_praise_content_other',
    method: 'post',
    data
  })
}