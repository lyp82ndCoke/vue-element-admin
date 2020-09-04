import request from '@/utils/groupRequset'
// 接口文档地址
// https://xdata.zmedc.com/service/chatroomdis/doc.html
// 获取商品列表 service/shop/item/get_item_list
export function getGoods(params) {
  return request({
    url: '/service/shop/item/get_item_list',
    method: 'get',
    params
  })
}

/*  获取商品详情
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | item_id| Y| 商品id |

*/
export function getGoodsDetail(params) {
  return request({
    url: '/service/shop/item/get_item_info',
    method: 'get',
    params
  })
}

/*  获取库存列表
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | item_id| Y| 商品id |

*/
export function getStockList(params) {
  return request({
    url: '/service/chatroomdis/chatroom/get_item_sku1_list',
    method: 'get',
    params
  })
}

/*  获取群list
    | 参数名称 | 是否必须 | 说明 |
    |------|------|----|
    | item_id| Y| 商品id |

*/
export function getGroupList(params) {
  return request({
    url: '/service/chatroomdis/chatroom/get_item_sku1_chatroomlist',
    method: 'get',
    params
  })
}

/*  获取辅导员list
    | 参数名称 | 是否必须 | 说明 |
    item_id 商品ID query true string
    sku1_kid 1级规格项ID query true ref
    sku1_vid 1级规格值ID   query true ref

*/
export function getCounselorList(params) {
  return request({
    url: '/service/shop/item/get_item_sku2',
    method: 'get',
    params
  })
}

/*  获取群用户list
    | 参数名称 | 是否必须 | 说明 |
     chatroom_code 群编码 query true string
    sku1_kid 1级规格项ID query true ref
    sku1_vid 1级规格值ID   query true ref

*/
export function getGroupUserList(params) {
  return request({
    url: '/service/chatroomdis/chatroom/get_item_sku1_chatroom_member_list',
    method: 'get',
    params
  })
}

/*  获取群用户list
    | 参数名称 | 是否必须 | 说明 |
     chatroom_code 群编码 query true string
    sku1_kid 1级规格项ID query true ref
    sku1_vid 1级规格值ID   query true ref

*/
export function getSkuDetail(params) {
  return request({
    url: '/service/shop/item/get_item_info',
    method: 'get',
    params
  })
}
/*  获取二维码list
    | 参数名称 | 是否必须 | 说明 |
     chatroom_code 群编码 query true string
    sku1_kid 1级规格项ID query true ref
    sku1_vid 1级规格值ID   query true ref

*/
export function getQrcodeList(params) {
  return request({
    url: '/service/chatroomdis/chatroom/get_sources_list',
    method: 'get',
    params
  })
}

/*  创建群
    | 参数名称 | 是否必须 | 说明 |
     real_status 修改状态 2入群 8移出群
    tid 订单id 
*/
export function addGroup(data) {
  return request({
    url: '/service/chatroomdis/chatroom/add_chatroom',
    method: 'post',
    data
  })
}
/*  创建群
    | 参数名称 | 是否必须 | 说明 |
     real_status 修改状态 2入群 8移出群
    tid 订单id 
*/
export function updateGroup(data) {
  return request({
    url: '/service/chatroomdis/chatroom/update_chatroom',
    method: 'post',
    data
  })
}
getGroupDetail
/*  获取群详细信息
    | 参数名称 | 是否必须 | 说明 |
     real_status 修改状态 2入群 8移出群
    tid 订单id 
*/
export function getGroupDetail(params) {
  return request({
    url: '/service/chatroomdis/chatroom/get_chatroom',
    method: 'get',
    params
  })
}
/*  修改入群状态
    | 参数名称 | 是否必须 | 说明 |
     real_status 修改状态 2入群 8移出群
    tid 订单id 
*/
export function changeUserGroupStatus(params) {
  return request({
    url: '/service/chatroomdis/chatroom/updateRealChatRoomStatus',
    method: 'get',
    params
  })
}

/*  获取订单list
    | 参数名称 | 是否必须 | 说明 |
     real_status 修改状态 2入群 8移出群
    tid 订单id 
*/
export function getOrderList(params) {
  return request({
    url: '/service/chatroomdis/trades/get_trade_list',
    method: 'get',
    params
  })
}


//查询标签列表
export function getLabelList(params) {
  return request({
    url: '/service/basedata/label/get_lable_list',
    method: 'get',
    params
  })
}


//分页查询 - 查询优惠券/码列表
export function getCouponList(params) {
  return request({
    url: '/service/basedata/youzan/coupons/get_coupon_list',
    method: 'get',
    params
  })
}
