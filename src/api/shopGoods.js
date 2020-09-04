// 商城模块
// 商品管理
import request from '@/utils/mallRequest'

//商品管理 商品列表
export function getItemList(params) {
  return request({
    url: '/service/shop/item/get_item_list',
    method: 'get',
    params
  })
}

/*  获取商品二级SKU规格
*/
export function getItemsku(params) {
  return request({
    url: '/service/shop/item/get_item_sku1',
    method: 'get',
    params
  })
}

//查询SKU规格项列表
export function getSkuList(params) {
  return request({
    url: '/service/shop/item/get_sku_k_list',
    method: 'get',
    params
  })
}
/*
  查询SKU规格值列表
  | 请求参数 | 是否必须 | 说明
  | sku_kid | Y | 规格ID
 */
export function getSkuValueList(params) {
  return request({
    url: '/service/shop/item/get_sku_v_list',
    method: 'get',
    params
  })
}
/*
  添加商品详情信息
  | 请求参数 | 是否必须 | 说明
  | item_content | Y | 商品详情页面信息
  | item_id | Y | 商品ID
 */
export function addItemContent(data) {
  return request({
    url: '/service/shop/item/add_item_content',
    method: 'POST',
    data
  })
}
//添加商品信息
export function addItemInfo(data) {
  return request({
    url: '/service/shop/item/add_item',
    method: 'POST',
    data
  })
}
/*
  添加SKU规格项
  | 请求参数 | 是否必须 | 说明
  | sku_k | Y | 规格名称
 */
export function addSkuProject(data) {
  return request({
    url: '/service/shop/item/add_sku_k',
    method: 'post',
    data
  })
}
/*
  添加SKU规格值
  | 请求参数 | 是否必须 | 说明
  | sku_kid | Y | 规格ID
  | sku_v | Y | 规格值
 */
export function addSkuValue(data) {
  return request({
    url: '/service/shop/item/add_sku_v',
    method: 'post',
    data
  })
}
//添加商品规格明细表
export function addItemSkuDetail(data) {
  return request({
    url: '/service/shop/item/add_item_sku_detail_json',
    method: 'POST',
    data
  })
}
//修改商品信息
export function updateItem(data) {
  return request({
    url: '/service/shop/item/update_item',
    method: 'POST',
    data
  })
}
//获取商品规格明细表
// export function getGoodsSkus(params) {
//   return request({
//     url: '/service/shop/item/get_item_info',
//     method: 'get',
//     params
//   })
// }
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

// 接口地址：http://xdata.zmedc.com/service/campschatroom/doc.html
/* 
  群管理列表 - 3.20
  参数名称 | 是否必须 | 说明 
  page_no | Y | 页码 
  page_size | Y | 页大小 
*/
export function getChatroomData(params) {
  return request({
    url: '/service/campschatroom/chatroom/get_chatroom_data_list',
    method: 'get',
    params
  })
}

/* 
  查询管理员辅导员列表 - 52.1
  参数名称 | 是否必须 | 说明 
  page_no | Y | 页码 
  page_size | Y | 页大小 
  user_name | N | 人员名称
*/
export function getManagerList(params) {
  return request({
    url: '/service/campschatroom/portal/get_mamager_list',
    method: 'get',
    params
  })
}

// 接口地址：https://xdata.zmedc.com/service/campschatroom/doc.html
/* 
  库存管理(商品级) - 3.14
  参数名称 | 是否必须 | 说明 
  page_no | Y | 页码 
  page_size | Y | 页大小 
*/

export function getStockList(params) {
  return request({
    url: '/service/campschatroom/chatroom/get_item_list',
    method: 'get',
    params
  })
}

/* 
  规格级(默认一级规格) - 3.15
  参数名称 | 是否必须 | 说明 
  page_no | Y | 页码 
  page_size | Y | 页大小 
  item_id | Y | 商品id
*/

export function getSkusList(params) {
  return request({
    url: '/service/campschatroom/chatroom/get_item_sku1_list',
    method: 'get',
    params
  })
}


/* 
  查询群用户 - 3.17
  参数名称 | 是否必须 | 说明 
  page_no | Y | 页码 
  page_size | Y | 页大小 
  chatroom_code | Y | 群编码
*/

export function getChatroomUserList(params) {
  return request({
    url: '/service/campschatroom/chatroom/get_chatroom_member_list',
    method: 'get',
    params
  })
}

/* 
  修改入群状态 - 3.18
  参数名称 | 是否必须 | 说明 
  real_status | Y | 修改状态 3入群 8移出群 
  tid | Y | 订单ID
*/

export function updateRealChat(params) {
  return request({
    url: '/service/campschatroom/chatroom/updateRealChatRoomStatus',
    method: 'get',
    params
  })
}

// 获取商品规格对应小程序商品ID
export function getMiniProgram(params) {
  return request({
    url: '/service/shop/item/get_xiao_item_list',
    method: 'get',
    params
  })
}

// 订单列表
export function getGoodsOrderList(params) {
  return request({
    url: '/service/shop/trades/get_trade_list',
    method: 'get',
    params
  })
}

// 查询所有商品列表
export function getItemListAll(params) {
  return request({
    url: '/service/shop/item/get_item_list_all',
    method: 'get',
    params
  })
}

//查询成长记录分类
export function getSharinList(params) {
  return request({
    url: 'https://xdata.zmedc.com/service/basedata/camps/sharin_records_type',
    method: 'get',
    params
  })
}

//修改商品可搜索状态
export function updateSearch(params) {
  return request({
    url: '/service/shop/item/update_item_search_flag',
    method: 'get',
    params
  })
}

