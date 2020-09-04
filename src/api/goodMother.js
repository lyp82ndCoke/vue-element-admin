//好妈妈会员项目
/*
  接口地址 
  https://xdata.zmedc.com/service/campschatroom/doc.html
  https://xdata.zmedc.com/service/shop/doc.html
*/
import request from '@/utils/mallRequest'

/*
  查询群列表 
  请求参数 | 是否必填 | 描述
  page_no  | Y | 页码
  page_size  | Y | 页大小
  chatroom_code  | N | 群编码
  chatroom_name  | N | 群名称
  item_id  | N | 商品ID
  sku_id  | N | 规格ID
*/
export function getChatroomList(params){
  return request({
    url: '/service/campschatroom/chatroom/get_chatroom_list',
    method: 'get',
    params
  })
}

/*
  创建群 
  请求参数 | 是否必填 | 描述
*/
export function addChatroom(data){
  return request({
    url: '/service/campschatroom/chatroom/add_chatroom',
    method: 'post',
    data
  })
}

/* 
  获取修改群的信息 
  请求参数 | 是否必填 | 描述
  chatroom_code | Y | 群编码
*/
export function getChatroomDetails(params){
  return request({
    url: '/service/campschatroom/chatroom/get_chatroom',
    method: 'get',
    params
  })
}


// 修改群
export function updateChatroom(data){
  return request({
    url: '/service/campschatroom/chatroom/update_chatroom',
    method: 'post',
    data
  })
}
// 创建二维码
export function addSources(data){
  return request({
    url: '/service/campschatroom/chatroom/add_sources',
    method: 'post',
    data
  })
}
// 修改二维码
export function updateSources(data){
  return request({
    url: '/service/campschatroom/chatroom/update_sources',
    method: 'post',
    data
  })
}
// 二维码列表
export function getSourcesList(params){
  return request({
    url: '/service/campschatroom/chatroom/get_sources_list',
    method: 'get',
    params
  })
}
